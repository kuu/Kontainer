var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

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

    base += Writer.writeNumber(FullBox.date2sec(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.date2sec(modificationTime), buffer, base, byteLength);
    base += Writer.writeNumber(timeScale, buffer, base, 4);
    base += Writer.writeNumber(duration, buffer, base, byteLength);
    base += Writer.writeIso639Lang(language, buffer, base, 1);
    base += Writer.writeNumber(0, buffer, base, 2);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props, byteLength,
        creationTime, modificationTime,
        timeScale, duration, language;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;
    byteLength = props.version ? 8 : 4;

    [readBytesNum, creationTime] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, modificationTime] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, timeScale] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, duration] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, language] = Reader.readIso639Lang(buffer, base);
    base += readBytesNum;

    props.creationTime = FullBox.sec2date(creationTime);
    props.modificationTime = FullBox.sec2date(modificationTime);
    props.timeScale = timeScale;
    props.duration = duration;
    props.language = language;

    return [base - offset, props];
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
