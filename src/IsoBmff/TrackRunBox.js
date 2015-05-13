var Box = require('./Box'),
    FullBox = require('./FullBox'),
    TrackExtendsBox = require('./TrackExtendsBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class TrackRunBox extends FullBox {
  constructor(props) {
    super(TrackRunBox.COMPACT_NAME, props, 0, TrackRunBox.encodeFlags(props));
  }

  static encodeFlags(props) {
    var f = 0, samples = props.samples;

    if (props.dataOffset !== void 0) {
      f |= (1 << 0);
    }

    if (props.firstSampleFlags !== void 0) {
      f |= (1 << 2);
    }

    if (samples.length > 0) {
      if (samples[0].duration !== void 0) {
        f |= (1 << 8);
      }
      if (samples[0].size !== void 0) {
        f |= (1 << 9);
      }
      if (samples[0].flags !== void 0) {
        f |= (1 << 10);
      }
      if (samples[0].compositionTimeOffset !== void 0) {
        f |= (1 << 11);
      }
    }

    return f;
  }

  static decodeFlags(f) {
    var flags = {
      dataOffsetPresent: false,
      firstSampleFlagsPresent: false,
      sampleDurationPresent: false,
      sampleSizePresent: false,
      sampleFlagsPresent: false,
      sampleCompositionTimeOffsetPresent: false
    };
    if ((f >> 0) & 0x01) {
      flags.dataOffsetPresent = true;
    }
    if ((f >> 2) & 0x01) {
      flags.firstSampleFlagsPresent = true;
    }
    if ((f >> 8) & 0x01) {
      flags.sampleDurationPresent = true;
    }
    if ((f >> 9) & 0x01) {
      flags.sampleSizePresent = true;
    }
    if ((f >> 10) & 0x01) {
      flags.sampleFlagsPresent = true;
    }
    if ((f >> 11) & 0x01) {
      flags.sampleCompositionTimeOffsetPresent = true;
    }
    return flags;
  }

  serialize(buffer, offset=0) {
    //console.log('--- TrackRunBox.serialize enter.');
    var props = this.props,
        samples = props.samples,
        dataOffset = props.dataOffset,
        firstSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.firstSampleFlags),
        base = offset;

    base += super.serialize(buffer, base);

    base += Writer.writeNumber(samples.length, buffer, base, 4);

    if (dataOffset !== void 0) {
      base += Writer.writeNumber(dataOffset, buffer, base, 4);
    }
    if (firstSampleFlags !== void 0) {
      base += Writer.writeNumber(firstSampleFlags, buffer, base, 4);
    }
    samples.forEach(sample => {
      if (sample.duration !== void 0) {
        base += Writer.writeNumber(sample.duration, buffer, base, 4);
      }
      if (sample.size !== void 0) {
        base += Writer.writeNumber(sample.size, buffer, base, 4);
      }
      if (sample.flags !== void 0) {
        base += Writer.writeNumber(TrackExtendsBox.encodeDefaultSampleFlags(sample.flags), buffer, base, 4);
      }
      if (sample.compositionTimeOffset !== void 0) {
        base += Writer.writeNumber(sample.compositionTimeOffset, buffer, base, 4);
      }
    });

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- TrackRunBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset, readBytesNum, props, flags,
        sampleCount, samples, dataOffset, firstSampleFlags,
        sample, sampleDuration, sampleSize,
        sampleFlags, sampleCompositionTimeOffset;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, sampleCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    samples = new Array(sampleCount);

    flags = TrackRunBox.decodeFlags(props.flags);

    if (flags.dataOffsetPresent) {
      [readBytesNum, dataOffset] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      props.dataOffset = dataOffset;
    }

    if (flags.firstSampleFlagsPresent) {
      [readBytesNum, firstSampleFlags] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      props.firstSampleFlags = TrackExtendsBox.decodeDefaultSampleFlags(firstSampleFlags);
    }

    for (var i = 0; i < sampleCount; i++) {
      sample = samples[i] = {};

      if (flags.sampleDurationPresent) {
        [readBytesNum, sampleDuration] = Reader.readNumber(buffer, base, 4);
        base += readBytesNum;
        sample.duration = sampleDuration;
      }

      if (flags.sampleSizePresent) {
        [readBytesNum, sampleSize] = Reader.readNumber(buffer, base, 4);
        base += readBytesNum;
        sample.size = sampleSize;
      }

      if (flags.sampleFlagsPresent) {
        [readBytesNum, sampleFlags] = Reader.readNumber(buffer, base, 4);
        base += readBytesNum;
        sample.flags = TrackExtendsBox.decodeDefaultSampleFlags(sampleFlags);
      }

      if (flags.sampleCompositionTimeOffsetPresent) {
        [readBytesNum, sampleCompositionTimeOffset] = Reader.readNumber(buffer, base, 4);
        base += readBytesNum;
        sample.compositionTimeOffset = sampleCompositionTimeOffset;
      }
    }

    props.samples = samples;

    return [base - offset, props];
  }
}

TrackRunBox.COMPACT_NAME = 'trun';

TrackRunBox.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.object),
  dataOffset: PropTypes.number,
  firstSampleFlags: TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES
};

TrackRunBox.defaultProps = {
  samples: [],
  dataOffset: void 0,
  firstSampleFlags: void 0
};

TrackRunBox.spec = {
  container: 'traf',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = TrackRunBox;
