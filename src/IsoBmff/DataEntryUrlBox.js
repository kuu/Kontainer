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
    //console.log('--- DataEntryUrlBox.serialize enter.');
    var props = this.props,
        location = props.location,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeString(location, buffer, base);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- DataEntryUrlBox.serialize exit. size=${this.size}`);
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

    props.flags = DataReferenceBox.decodeFlags(props.flag);
    props.location = location;

    return [base - offset, props];
  }
}

DataEntryUrlBox.COMPACT_NAME = 'url ';

DataEntryUrlBox.propTypes = {
  version: PropTypes.number,
  flags: PropTypes.object,
  location: PropTypes.string.isRequired
};

DataEntryUrlBox.defaultProps = {
  version: 0,
  flags: {inTheSameFile: false}
};

DataEntryUrlBox.spec = {
  container: 'dref',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = DataEntryUrlBox;
