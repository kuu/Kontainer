import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class TrackExtendsBox extends FullBox {
  constructor(props) {
    super(TrackExtendsBox.COMPACT_NAME, props, 0, 0);
  }

  static encodeDefaultSampleFlags(flags) {
    let f = 0;

    if (!flags) {
      return void 0;
    }

    if (flags.sampleDependsOn === 'unknown') {
      f |= (0 << 6);
    } else if (flags.sampleDependsOn === 'non-I-picture') {
      f |= (1 << 6);
    } else if (flags.sampleDependsOn === 'I-picture') {
      f |= (2 << 6);
    }

    if (flags.sampleIsDependedOn === 'unknown') {
      f |= (0 << 8);
    } else if (flags.sampleIsDependedOn === 'non-disposable') {
      f |= (1 << 8);
    } else if (flags.sampleIsDependedOn === 'disposable') {
      f |= (2 << 8);
    }

    if (flags.sampleHasRedundancy === 'unknown') {
      f |= (0 << 10);
    } else if (flags.sampleHasRedundancy === 'redundant') {
      f |= (1 << 10);
    } else if (flags.sampleHasRedundancy === 'no-redundant') {
      f |= (2 << 10);
    }

    f |= (flags.samplePaddingValue << 12);
    f |= (flags.sampleIsDifferenceSample << 15);
    f |= (flags.sampleDegradationPriority << 16);

    return f;
  }

  static decodeDefaultSampleFlags(f) {
    const flags = {
      sampleDependsOn: '',
      sampleIsDependedOn: '',
      sampleHasRedundancy: '',
      samplePaddingValue: 0,
      sampleIsDifferenceSample: false,
      sampleDegradationPriority: 0
    };

    let v = (f >>> 6) & 0x03;
    if (v === 0) {
      flags.sampleDependsOn = 'unknown';
    } else if (v === 1) {
      flags.sampleDependsOn = 'non-I-picture';
    } else if (v === 2) {
      flags.sampleDependsOn = 'I-picture';
    }

    v = (f >>> 8) & 0x03;
    if (v === 0) {
      flags.sampleIsDependedOn = 'unknown';
    } else if (v === 1) {
      flags.sampleIsDependedOn = 'non-disposable';
    } else if (v === 2) {
      flags.sampleIsDependedOn = 'disposable';
    }

    v = (f >>> 10) & 0x03;
    if (v === 0) {
      flags.sampleHasRedundancy = 'unknown';
    } else if (v === 1) {
      flags.sampleHasRedundancy = 'redundant';
    } else if (v === 2) {
      flags.sampleHasRedundancy = 'no-redundant';
    }

    flags.samplePaddingValue = (f >>> 12) & 0x07;
    flags.sampleIsDifferenceSample = !!((f >>> 15) & 0x01);
    flags.sampleDegradationPriority = (f >>> 16) & 0xFFFF;

    return flags;
  }

  serialize(buffer, offset=0) {
    //console.log('--- TrackExtendsBox.serialize enter.');
    const props = this.props;
    const trackId = props.trackId;
    const defaultSampleDescriptionIndex = props.defaultSampleDescriptionIndex;
    const defaultSampleDuration = props.defaultSampleDuration;
    const defaultSampleSize = props.defaultSampleSize;
    const defaultSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.defaultSampleFlags);

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(trackId, buffer, base, 4);
    base += Writer.writeNumber(defaultSampleDescriptionIndex, buffer, base, 4);
    base += Writer.writeNumber(defaultSampleDuration, buffer, base, 4);
    base += Writer.writeNumber(defaultSampleSize, buffer, base, 4);
    base += Writer.writeNumber(defaultSampleFlags, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- TrackExtendsBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        trackId, defaultSampleDescriptionIndex,
        defaultSampleDuration, defaultSampleSize, defaultSampleFlags;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, trackId] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, defaultSampleDescriptionIndex] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, defaultSampleDuration] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, defaultSampleSize] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, defaultSampleFlags] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.trackId = trackId;
    props.trackId = trackId;
    props.defaultSampleDescriptionIndex = defaultSampleDescriptionIndex;
    props.defaultSampleDuration = defaultSampleDuration;
    props.defaultSampleSize = defaultSampleSize;
    props.defaultSampleFlags = TrackExtendsBox.decodeDefaultSampleFlags(defaultSampleFlags);

    return [base - offset, props];
  }
}

TrackExtendsBox.COMPACT_NAME = 'trex';

TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES = PropTypes.shape({
  sampleDependsOn: PropTypes.oneOf(['unknown', 'non-I-picture', 'I-picture']),
  sampleIsDependedOn: PropTypes.oneOf(['unknown', 'non-disposable', 'disposable']),
  sampleHasRedundancy: PropTypes.oneOf(['unknown', 'redundant', 'no-redundant']),
  samplePaddingValue: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
  sampleIsDifferenceSample: PropTypes.bool,
  sampleDegradationPriority: PropTypes.number
});

TrackExtendsBox.propTypes = {
  trackId: PropTypes.number.isRequired,
  defaultSampleDescriptionIndex: PropTypes.number.isRequired,
  defaultSampleDuration: PropTypes.number.isRequired,
  defaultSampleSize: PropTypes.number.isRequired,
  defaultSampleFlags: TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES.isRequired
};

TrackExtendsBox.defaultProps = {
  version: 0
};

TrackExtendsBox.spec = {
  container: 'mvex',
  quantity: Box.QUANTITY_ANY_NUMBER, // Actually exactly one for each track.
  mandatoryBoxList: []
};
