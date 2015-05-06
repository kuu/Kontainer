var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class DataReferenceBox extends FullBox {
  constructor(props) {
    super(DataReferenceBox.COMPACT_NAME, props, props.version, 0);
  }

  static encodeFlags(flags) {
    var f = 0;
    if (flags.inTheSameFile) {
      f |= 0x01;
    }
    return f;
  }

  static decodeFlags(f) {
    var flags = {
      inTheSameFile: false
    };

    if (f & 0x01) {
      flags.inTheSameFile = true;
    }
    return flags;
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        entryCount = props.entryCount,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeNumber(entryCount, buffer, base, 4);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        entryCount;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.entryCount = entryCount;

    return [base - offset, props];
  }
}

DataReferenceBox.COMPACT_NAME = 'dref';

DataReferenceBox.propTypes = {
  version: PropTypes.number,
  entryCount: PropTypes.number.isRequired
};

DataReferenceBox.defaultProps = {
  version: 0
};

DataReferenceBox.spec = {
  container: 'dinf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = DataReferenceBox;
