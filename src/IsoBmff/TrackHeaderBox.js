var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer');

class TrackHeaderBox extends FullBox {
  constructor(props) {
    super(TrackHeaderBox.COMPACT_NAME, props, props.version, TrackHeaderBox.parseFlags(props.flags));
  }

  static parseFlags(flags) {
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

    base += Writer.writeNumber(FullBox.convertTime(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.convertTime(modificationTime), buffer, base, byteLength);
    base += Writer.writeNumber(trackId, buffer, base, 4);
    base += Writer.writeNumber(0, buffer, base, 4);
    base += Writer.writeNumber(duration, buffer, base, byteLength);
    base += Writer.writeNumber(0, buffer, base, 8);
    base += Writer.writeNumber(layer, buffer, base, 2);
    base += Writer.writeNumber(alternateGroup, buffer, base, 2);
    base += Writer.writeFixedNumber(volume, buffer, base, 2);
    base += Writer.writeFixedNumber(0, buffer, base, 2);
    base += Writer.writeNumber(0, buffer, base, 10);
    for (var i = 0; i < 9; i++) {
      base += Writer.writeFixedNumber(matrix[i], buffer, base, 4);
    }
    base += Writer.writeNumber(width, buffer, base, 4);
    base += Writer.writeNumber(height, buffer, base, 4);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
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
