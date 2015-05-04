var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer');

class MediaHeaderBox extends FullBox {
  constructor(props) {
    super(MediaHeaderBox.COMPACT_NAME, props, props.version, MediaHeaderBox.parseFlags(props.flags));
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
        timeScale = props.trackId | 0,
        duration = props.duration | 0,
        language = props.language,
        byteLength = version ? 8 : 4,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeNumber(FullBox.convertTime(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.convertTime(modificationTime), buffer, base, byteLength);
    base += Writer.writeNumber(timeScale, buffer, base, 4);
    base += Writer.writeNumber(duration, buffer, base, byteLength);
    base += Writer.writeIso639_2_T(language, buffer, base, 1);
    base += Writer.writeNumber(0, buffer, base, 2);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }
}

MediaHeaderBox.COMPACT_NAME = 'mdhd';

MediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  creationTime: PropTypes.instanceOf(Date),
  modificationTime: PropTypes.instanceOf(Date),
  timeScale: PropTypes.number.isRequired,
  duration: PropTypes.number,
  language: PropTypes.string
};

MediaHeaderBox.defaultProps = {
  version: 0,
  creationTime: null,
  modificationTime: null,
  duration: 0xFFFFFFFF,
  language: 'eng'
};

MediaHeaderBox.spec = {
  container: 'mdia',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = MediaHeaderBox;
