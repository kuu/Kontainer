import Box from './Box';
import FullBox from './FullBox';
import TrackExtendsBox from './TrackExtendsBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class TrackFragmentHeaderBox extends FullBox {
  constructor(props) {
    super(TrackFragmentHeaderBox.COMPACT_NAME, props, 0, TrackFragmentHeaderBox.encodeFlags(props));
  }

  static encodeFlags(props) {
    let f = 0;
    if (props.baseDataOffset !== void 0) {
      f |= (1 << 0);
    }
    if (props.sampleDescriptionIndex !== void 0) {
      f |= (1 << 1);
    }
    if (props.defaultSampleDuration !== void 0) {
      f |= (1 << 3);
    }
    if (props.defaultSampleSize !== void 0) {
      f |= (1 << 4);
    }
    if (props.defaultSampleFlags !== void 0) {
      f |= (1 << 5);
    }
    if (props.durationIsEmpty) {
      f |= (1 << 16);
    }
    return f;
  }

  static decodeFlags(f) {
    const flags = {
      baseDataOffsetPresent: false,
      sampleDescriptionIndexPresent: false,
      defaultSampleDurationPresent: false,
      defaultSampleSizePresent: false,
      defaultSampleFlagsPresent: false,
      durationIsEmpty: false
    };
    if ((f >> 0) & 0x01) {
      flags.baseDataOffsetPresent = true;
    }
    if ((f >> 1) & 0x01) {
      flags.sampleDescriptionIndexPresent = true;
    }
    if ((f >> 3) & 0x01) {
      flags.defaultSampleDurationPresent = true;
    }
    if ((f >> 4) & 0x01) {
      flags.defaultSampleSizePresent = true;
    }
    if ((f >> 5) & 0x01) {
      flags.defaultSampleFlagsPresent = true;
    }
    if ((f >> 16) & 0x01) {
      flags.durationIsEmpty = true;
    }
    return flags;
  }

  serialize(buffer, offset=0) {
    //console.log('--- TrackFragmentHeaderBox.serialize enter.');
    const props = this.props;
    const trackId = props.trackId;
    const baseDataOffset = props.baseDataOffset;
    const sampleDescriptionIndex = props.sampleDescriptionIndex;
    const defaultSampleDuration = props.defaultSampleDuration;
    const defaultSampleSize = props.defaultSampleSize;
    const defaultSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.defaultSampleFlags);

    let base = offset;

    base += super.serialize(buffer, base);

    base += Writer.writeNumber(trackId, buffer, base, 4);

    if (baseDataOffset !== void 0) {
      base += Writer.writeNumber(baseDataOffset, buffer, base, 8);
    }
    if (sampleDescriptionIndex !== void 0) {
      base += Writer.writeNumber(sampleDescriptionIndex, buffer, base, 4);
    }
    if (defaultSampleDuration !== void 0) {
      base += Writer.writeNumber(defaultSampleDuration, buffer, base, 4);
    }
    if (defaultSampleSize !== void 0) {
      base += Writer.writeNumber(defaultSampleSize, buffer, base, 4);
    }
    if (defaultSampleFlags !== void 0) {
      base += Writer.writeNumber(defaultSampleFlags, buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- TrackFragmentHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props, flags,
        trackId, baseDataOffset,
        sampleDescriptionIndex, defaultSampleDuration,
        defaultSampleSize, defaultSampleFlags;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, trackId] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;
    props.trackId = trackId;

    flags = TrackFragmentHeaderBox.decodeFlags(props.flags);

    if (flags.baseDataOffsetPresent) {
      [readBytesNum, baseDataOffset] = Reader.readNumber(buffer, base, 8);
      base += readBytesNum;
      props.baseDataOffset = baseDataOffset;
    }

    if (flags.sampleDescriptionIndexPresent) {
      [readBytesNum, sampleDescriptionIndex] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      props.sampleDescriptionIndex = sampleDescriptionIndex;
    }

    if (flags.defaultSampleDurationPresent) {
      [readBytesNum, defaultSampleDuration] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      props.defaultSampleDuration = defaultSampleDuration;
    }

    if (flags.defaultSampleSizePresent) {
      [readBytesNum, defaultSampleSize] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      props.defaultSampleSize = defaultSampleSize;
    }

    if (flags.defaultSampleFlagsPresent) {
      [readBytesNum, defaultSampleFlags] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      props.defaultSampleFlags = TrackExtendsBox.decodeDefaultSampleFlags(defaultSampleFlags);
    }

    props.durationIsEmpty = flags.durationIsEmpty;

    return [base - offset, props];
  }
}

TrackFragmentHeaderBox.COMPACT_NAME = 'tfhd';

TrackFragmentHeaderBox.propTypes = {
  trackId: PropTypes.number.isRequired,
  baseDataOffset: PropTypes.number,
  sampleDescriptionIndex: PropTypes.number,
  defaultSampleDuration: PropTypes.number,
  defaultSampleSize: PropTypes.number,
  defaultSampleFlags: TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES,
  durationIsEmpty: PropTypes.bool
};

TrackExtendsBox.defaultProps = {
  baseDataOffset: void 0,
  sampleDescriptionIndex: void 0,
  defaultSampleDuration: void 0,
  defaultSampleSize: void 0,
  defaultSampleFlags: void 0,
  durationIsEmpty: false
};

TrackFragmentHeaderBox.spec = {
  container: 'traf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
