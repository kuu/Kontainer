import Box from './Box/Box';
import createUnknownBox from './Box/UnknownBox';
import {throwException} from '../core/Util';
import {BufferReadError} from '../core/Error';

const clazz = {
  'file': require('./Box/File').default,
  'ftyp': require('./Box/FileTypeBox').default,
  'moov': require('./Box/MovieBox').default,
  'mvhd': require('./Box/MovieHeaderBox').default,
  'trak': require('./Box/TrackBox').default,
  'tkhd': require('./Box/TrackHeaderBox').default,
  'mdia': require('./Box/MediaBox').default,
  'mdhd': require('./Box/MediaHeaderBox').default,
  'hdlr': require('./Box/HandlerReferenceBox').default,
  'minf': require('./Box/MediaInformationBox').default,
  'vmhd': require('./Box/VideoMediaHeaderBox').default,
  'smhd': require('./Box/SoundMediaHeaderBox').default,
  'hmhd': require('./Box/HintMediaHeaderBox').default,
  'nmhd': require('./Box/NullMediaHeaderBox').default,
  'dinf': require('./Box/DataInformationBox').default,
  'dref': require('./Box/DataReferenceBox').default,
  'url ': require('./Box/DataEntryUrlBox').default,
  'urn ': require('./Box/DataEntryUrnBox').default,
  'stbl': require('./Box/SampleTableBox').default,
  'stsd': require('./Box/SampleDescriptionBox').default,
  'avc1': require('./Box/AVCSampleEntry').default,
  'avcC': require('./Box/AVCConfigurationBox').default,
  'stts': require('./Box/TimeToSampleBox').default,
  'stsz': require('./Box/SampleSizeBox').default,
  'stz2': require('./Box/CompactSampleSizeBox').default,
  'stsc': require('./Box/SampleToChunkBox').default,
  'stco': require('./Box/ChunkOffsetBox').default,
  'mp4a': require('./Box/MP4AudioSampleEntry').default,
  'esds': require('./Box/ESDBox').default,
  'mdat': require('./Box/MediaDataBox').default,
  'btrt': require('./Box/MPEG4BitRateBox').default,
  'stss': require('./Box/SyncSampleBox').default,
  'mvex': require('./Box/MovieExtendsBox').default,
  'mehd': require('./Box/MovieExtendsHeaderBox').default,
  'trex': require('./Box/TrackExtendsBox').default,
  'moof': require('./Box/MovieFragmentBox').default,
  'mfhd': require('./Box/MovieFragmentHeaderBox').default,
  'traf': require('./Box/TrackFragmentBox').default,
  'tfhd': require('./Box/TrackFragmentHeaderBox').default,
  'trun': require('./Box/TrackRunBox').default,
  'tfdt': require('./Box/TrackFragmentBaseMediaDecodeTimeBox').default,
  'edts': require('./Box/EditBox').default,
  'elst': require('./Box/EditListBox').default,
};

function getComponentClass(name) {
  return clazz[name];
}

function parseTypeAndSize(buffer, offset, options={}) {
  let readBytesNum, props;

  [readBytesNum, props] = Box.parse(buffer, offset);

  //console.log(`IsoBmff.parseTypeAndSize: props.type="${props.type}"`);

  const boxSize = props.size || buffer.length - offset;
  const boxType = (props.type === 'uuid' ? props.extendedType : props.type);

  if (boxType.length < 4 || boxType.search(/^[a-z]{1}[\w\s]{3}$/g) !== 0) {
    //console.error(`IsoBmff.parseTypeAndSize: Invalid type - "${boxType}"`);
    return [readBytesNum, null, boxSize];
  }

  let boxClass = clazz[boxType];

  if (!boxClass && !options.ignoreUnknown) {
    //console.error(`IsoBmff.parseTypeAndSize: Unsupported type - "${boxType}"`);
    return [readBytesNum, createUnknownBox(boxType), boxSize];
  }
  return [readBytesNum, boxClass, boxSize];
}

function getRootWrapperClass() {
  return clazz['file'];
}

function skipBytes(buffer, offset) {
  const names = Object.keys(clazz);

  for (let i = offset; i < buffer.length; i++) {
    const end = i + 4;
    const chars = [];
    for (let j = i; j < end; j++) {
      chars.push(String.fromCharCode(buffer[j]));
    }
    if (names.indexOf(chars.join('')) !== -1) {
      return j - offset;
    }
  }
  throwException('IsoBmff.skipBytes: Reached the end of buffer.');
}

function canParse(buffer, offset) {
  let readBytesNum, componentClass;

  try {
    [readBytesNum, componentClass] = parseTypeAndSize(buffer, offset);
    if (componentClass) {
      [readBytesNum] = componentClass.parse(buffer, offset);
      return true;
    }
  } catch (err) {
    if (componentClass && err.message === BufferReadError.ERROR_MESSAGE) {
      return true;
    }
  }
  return false;
}

export default {
  getComponentClass,
  parseTypeAndSize,
  getRootWrapperClass,
  skipBytes,
  canParse
};
