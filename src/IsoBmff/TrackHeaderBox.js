var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class TrackHeaderBox extends FullBox {
  constructor(props) {
    super(TrackHeaderBox.COMPACT_NAME, props, props.version, TrackHeaderBox.encodeFlags(props.flags));
  }

  static encodeFlags(flags) {
    var f = 0;
    if (flags.enabled) {
      f |= 0x01;
    }
    if (flags.inMovie) {
      f |= 0x02;
    }
    if (flags.inPreview) {
      f |= 0x04;
    }
    return f;
  }

  static decodeFlags(f) {
    var flags = {
      enabled: false,
      inMovie: false,
      inPreview: false
    };

    if (f & 0x01) {
      flags.enabled = true;
    }
    if (f & 0x02) {
      flags.inMovie = true;
    }
    if (f & 0x04) {
      flags.inPreview = true;
    }
    return flags;
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        version = props.version,
        creationTime = props.creationTime || new Date(),
        modificationTime = props.modificationTime || new Date(),
        trackId = props.trackId | 0,
        duration = props.duration | 0,
        layer = props.layer,
        alternateGroup = props.alternateGroup | 0,
        volume = props.volume,
        matrix = props.matrix,
        width = props.width,
        height = props.height,
        byteLength = version ? 8 : 4,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeNumber(FullBox.date2sec(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.date2sec(modificationTime), buffer, base, byteLength);
    base += Writer.writeNumber(trackId, buffer, base, 4);
    base += Writer.writeNumber(0, buffer, base, 4);
    base += Writer.writeNumber(duration, buffer, base, byteLength);
    base += Writer.writeNumber(0, buffer, base, 8);
    base += Writer.writeNumber(layer, buffer, base, 2);
    base += Writer.writeNumber(alternateGroup, buffer, base, 2);
    base += Writer.writeFixedNumber(volume, buffer, base, 2);
    base += Writer.writeNumber(0, buffer, base, 2);
    for (var i = 0; i < 9; i++) {
      base += Writer.writeFixedNumber(matrix[i], buffer, base, 4);
    }
    base += Writer.writeNumber(width, buffer, base, 4);
    base += Writer.writeNumber(height, buffer, base, 4);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props, byteLength,
        creationTime, modificationTime,
        trackId, duration, layer, alternateGroup,
        volume, matrix = new Array(9), width, height;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;
    byteLength = props.version ? 8 : 4;

    [readBytesNum, creationTime] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, modificationTime] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, trackId] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    base += 4; // skip reserved

    [readBytesNum, duration] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    base += 8; // skip reserved

    [readBytesNum, layer] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, alternateGroup] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, volume] = Reader.readFixedNumber(buffer, base, 2);
    base += readBytesNum;

    base += 2; // skip reserved

    for (var i = 0; i < 9; i++) {
      [readBytesNum, matrix[i]] = Reader.readFixedNumber(buffer, base, 4);
      base += readBytesNum;
    }

    [readBytesNum, width] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, height] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.creationTime = FullBox.sec2date(creationTime);
    props.modificationTime = FullBox.sec2date(modificationTime);
    props.trackId = trackId;
    props.duration = duration;
    props.layer = layer;
    props.alternateGroup = alternateGroup;
    props.volume = volume;
    props.matrix = matrix;
    props.width = width;
    props.height = height;

    return [base - offset, props];
  }
}

TrackHeaderBox.COMPACT_NAME = 'tkhd';

TrackHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  flags: PropTypes.shape({
    enabled: PropTypes.bool,
    inMovie: PropTypes.bool,
    inPreview: PropTypes.bool
  }),
  creationTime: PropTypes.instanceOf(Date),
  modificationTime: PropTypes.instanceOf(Date),
  trackId: PropTypes.number.isRequired,
  duration: PropTypes.number,
  layer: PropTypes.number,
  alternateGroup: PropTypes.number,
  volume: PropTypes.number,
  matrix: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

TrackHeaderBox.defaultProps = {
  version: 0,
  flags: {
    enabled: true,
    inMovie: true,
    inPreview: false
  },
  creationTime: null,
  modificationTime: null,
  duration: 0xFFFFFFFF,
  layer: 0,
  alternateGroup: 0,
  volume: 1.0,
  matrix: [1, 0, 0, 0, 1, 0, 0, 0, 16384]
};

TrackHeaderBox.spec = {
  container: 'trak',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = TrackHeaderBox;
