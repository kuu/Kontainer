var Writer = require('../util/Writer');

class Box {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    this.size = 0;
  }

  serialize(buffer, offset=0) {
    var base = offset,
        size = this.size,
        type = this.type;

    if (size < 4294967296) {
      base += Writer.writeNumber(size, buffer, base, 4);
    } else {
      console.error('IsoBmff.Box.serialize: largesize(>4GB) is not supported.');
      return 0;
    }

    base += Writer.writeString(type, buffer, base, 4);

    if (type === 'uuid') {
      base += Writer.writeString(this.props.extendedType, buffer, base, 16);
    }

    return base - offset;
  }

  updateSize(buffer, offset=0) {
    var base = offset,
        size = this.size;

    if (size < 4294967296) {
      base += Writer.writeNumber(size, buffer, base, 4);
    } else {
      console.error('IsoBmff.Box.serialize: largesize(>4GB) is not supported.');
      return 0;
    }
    return base - offset;
  }
}

Box.HEADER_LENGTH = 8;
Box.UUID_HEADER_LENGTH = 24;

module.exports = Box;
