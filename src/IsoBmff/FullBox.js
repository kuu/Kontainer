var Box = require('./Box'),
    Writer = require('../core/Writer');

class FullBox extends Box {
  constructor(type, props, version, flags) {
    super(type, props);
    this.version = version;
    this.flags = flags;
  }

  serialize(buffer, offset=0) {
    var version = this.version,
        flags = this.flags,
        base = offset + (this.type === 'uuid' ? Box.UUID_HEADER_LENGTH : Box.HEADER_LENGTH);

    // version is unsigned int(8)
    if (version > 255) {
      console.warn('IsoBmff.FullBox.serialize: the version does not fit within unsigned int (8).');
    }

    base += Writer.writeNumber(version, buffer, base, 1);

    // flags is bit(24)
    if (flags >>> 24) {
      console.warn('IsoBmff.FullBox.serialize: the flags does not fit within bit(24).');
    }

    base += Writer.writeNumber(flags, buffer, base, 3);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static convertTime(date) {
    const SECONDS_BTW_1904_1970 = 2082844800;
    return ((date.getTime() / 1000) | 0) + SECONDS_BTW_1904_1970;
  }
}

module.exports = FullBox;
FullBox.HEADER_LENGTH = Box.HEADER_LENGTH + 4;
FullBox.UUID_HEADER_LENGTH = Box.UUID_HEADER_LENGTH + 4;
