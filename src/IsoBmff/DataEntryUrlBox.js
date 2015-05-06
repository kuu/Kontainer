var Box = require('./Box'),
    FullBox = require('./FullBox'),
    DataReferenceBox = require('./DataReferenceBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class DataEntryUrlBox extends FullBox {
  constructor(props) {
    super(DataEntryUrlBox.COMPACT_NAME, props, props.version, DataReferenceBox.encodeFlags(props.flags));
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        location = props.location,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeString(location, buffer, base);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        location;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, location] = Reader.readString(buffer, base);
    base += readBytesNum;

    props.location = location;

    return [base - offset, props];
  }
}

DataEntryUrlBox.COMPACT_NAME = 'url ';

DataEntryUrlBox.propTypes = {
  version: PropTypes.number,
  location: PropTypes.string.isRequired
};

DataEntryUrlBox.defaultProps = {
  version: 0
};

DataEntryUrlBox.spec = {
  container: 'dref',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = DataEntryUrlBox;
