var Box = require('./Box'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class FullBox extends Box {
  constructor(type, props, version, flags) {
    super(type, props);
    this.version = version;
    this.flags = flags;
  }

  serialize(buffer, offset=0) {
    //console.log('--- FullBox.serialize enter.');
    var version = this.version,
        flags = this.flags,
        base = offset;

    base += super.serialize(buffer, base);

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

    super.setSize(base - offset, buffer, offset);

    //console.log('--- FullBox.serialize exit.');
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        version, flags;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, version] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, flags] = Reader.readNumber(buffer, base, 3);
    base += readBytesNum;

    props.version = version;
    props.flags = flags;

    return [base - offset, props];
  }

  static date2sec(date) {
    const SECONDS_BTW_1904_1970 = 2082844800;
    return ((date.getTime() / 1000) | 0) + SECONDS_BTW_1904_1970;
  }

  static sec2date(sec) {
    const SECONDS_BTW_1904_1970 = 2082844800;
    return new Date(Math.max(0, sec - SECONDS_BTW_1904_1970) * 1000);
  }
}

module.exports = FullBox;
