import MediaFormat from '../core/MediaFormat';
import Box from './Box/Box';
import {TransformStream} from '../core/Stream';
import {BoxVisitor, IsoBmffDumpVisitor} from './BoxVisitor';
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
};

function validateChild(context, child) {
  const childSpec = child.type.spec;
  const childName = child.type.COMPACT_NAME;
  const checkList = context.mandatoryCheckList;
  const quantityTable = context.quantityTable;

  let container, quantity;

  // Container check.
  if (childSpec.container) {
    if (childSpec.container instanceof Array) {
      container = childSpec.container;
    } else {
      container = [childSpec.container];
    }
    if (container.indexOf(context.container) === -1) {
      return [false, '"' + childName + '" cannot be a child of "' + context.container + '"'];
    }
  }

  // Mandatory check.
  checkList[childName] = true;

  // Quantity check.
  if ((quantity = childSpec.quantity) !== Box.QUANTITY_ANY_NUMBER) {
    // Increment
    if (quantityTable[childName] === void 0) {
      quantityTable[childName] = 1;
    } else {
      quantityTable[childName]++;
    }
    // Validate
    if (quantity === Box.QUANTITY_EXACTLY_ONE) {
      if (quantityTable[childName] !== 1) {
        return [false, 'Quantity of ' + childName + ' should be exactly one.'];
      }
    } else if (quantity === Box.QUANTITY_ZERO_OR_ONE) {
      if (quantityTable[childName] > 1) {
        return [false, 'Quantity of ' + childName + ' should be zero or one.'];
      }
    }
  }
  return [true, null];
}

function createElement(type) {
  let componentClass, element, context = {},
      spec, result, errorMessage, checkList;

  // Validate type.
  if (typeof type === 'string') {
    componentClass = clazz[type];
    if (!componentClass) {
      console.error('IsoBmff.createElement: invalid type: "' + type + '"');
      return null;
    }
    arguments[0] = componentClass;
  } else if (!type || !(type.prototype instanceof Box)) {
    console.error('IsoBmff.createElement: "type" should be a subclass of the Box.');
    return null;
  } else {
    componentClass = type;
  }

  // Create element.
  if (!(element = MediaFormat.createElement.apply(this, arguments))) {
    return null;
  }

  // Validate children.
  spec = componentClass.spec;
  context = {
    container: componentClass.COMPACT_NAME,
    mandatoryCheckList: {},
    quantityTable: {}
  };

  if (!element.props.children.every(child => {
      [result, errorMessage] = validateChild(context, child);
      return result;
    })) {
    console.error('IsoBmff.createElement: Breaking the composition rule: ' + errorMessage);
    return null;
  }

  checkList = context.mandatoryCheckList;

  spec.mandatoryBoxList.forEach(boxType => {
    if (boxType instanceof Array) {
      if (boxType.some(box => checkList[box])) {
        return;
      }
      boxType = boxType.join('", or "');
    } else {
      if (checkList[boxType]) {
        return;
      }
    }
    console.error('IsoBmff.createElement: Breaking the composition rule: "' +
      boxType + '" is required as a child of "' + context.container + '"');
    element = null;
  });

  return element;
}

function parse(buffer, offset, visitor) {
  let readBytesNum;
  let props;
  let base = offset;

  // Read the Box params as we don't know the type.
  [readBytesNum, props] = Box.parse(buffer, offset);

  const boxSize = props.size || buffer.length - offset;
  const boxEnd = offset + boxSize;
  const boxType = (props.type === 'uuid' ? props.extendedType : props.type);
  const boxClass = clazz[boxType];

  //console.log(`parse enter.: type=${boxType} size=${boxSize} offset=${offset}`);

  if (!boxClass) {
    console.error(`IsoBmff.createElementFromBuffer: Unsupported type - "${boxType}"`);
    return boxSize;
  }

  [readBytesNum, props] = boxClass.parse(buffer, offset);
  base += readBytesNum;

  const stack = visitor.stack;
  visitor.offset = base;
  stack.push({type: boxClass, props, children: []});
  visitor.enter(boxClass, props);

  while (base < boxEnd) {
    readBytesNum = parse(buffer, base, visitor);
    base += readBytesNum;
  }
  const children = stack[stack.length - 1].children;
  const result = visitor.exit(boxClass, props, children);
  stack.pop();
  visitor.offset = base;
  if (result) {
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(result);
    } else {
      visitor.results.push(result);
    }
  }

  //console.log(`parse exit.: type=${boxType} readBytesNum=${Math.min(base - offset, boxSize)}`);
  return Math.min(base - offset, boxSize);
}

class ElementVisitor extends BoxVisitor {
  constructor() {
    super();
  }

  enter (type, props) {
    this.setData({element: MediaFormat.createElement(type, props)});
  }

  exit (type, props, children) {
    const {element} = this.getData();
    element.props.children = children;
    return element;
  }
}

function createElementFromBuffer(buffer, offset=0) {
  let base = offset;

  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer);
  }
  const endOfBuffer = base + buffer.length;

  const visitor = new ElementVisitor();

  try {
    while (base < endOfBuffer) {
      const readBytesNum = parse(buffer, base, visitor);
      base += readBytesNum;
    }
  } catch (err) {
    if (err.message !== BufferReadError.ERROR_MESSAGE) {
      console.error(`IsoBmff.transform: An error occurred in parsing the buffer: ${err.stack}`);
    }
    return null;
  }
  //console.log(`IsoBmff.createElementFromBuffer: Done. ${base - offset} bytes read.`);
  if (visitor.results.length === 0) {
    return null;
  } else if (visitor.results.length === 1) {
    return visitor.results[0];
  }
  return MediaFormat.createElement(clazz.file, null, visitor.results);
}

function transform(visitor) {
  const Kontainer = require('..').default; // Ugly..

  return new TransformStream((buffer, offset, done) => {
    let base = visitor.offset;
    let buf = buffer.getData();

    if (buf instanceof ArrayBuffer) {
      buf = new Uint8Array(buf);
    }
    const endOfBuffer = buf.length;
    const stack = visitor.stack;
    try {
      while (base < endOfBuffer) {
        const readBytesNum = parse(buf, base, visitor);
        base += readBytesNum;
      }
    } catch (err) {
      if (err.message !== BufferReadError.ERROR_MESSAGE) {
        console.error(`IsoBmff.transform: An error occurred in parsing the buffer: ${err.stack}`);
      }
      done(null, null);
      return;
    }

    while (stack.length) {
      const {type, props, children} = stack[stack.length - 1];
      const result = visitor.exit(type, props, children);
      stack.pop();
      if (result) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(result);
        } else {
          visitor.results.push(result);
        }
      }
    }
    done(null, Kontainer.renderToBuffer(MediaFormat.createElement(clazz.file, null, visitor.results)));
  });
}

export default {
  createElement,
  createElementFromBuffer,
  transform,
  BoxVisitor,
  ElementVisitor,
  IsoBmffDumpVisitor
};
