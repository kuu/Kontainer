var Box = require('./Box'),
    FullBox = require('./FullBox'),
    DataReferenceBox = require('./DataReferenceBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class DataEntryUrnBox extends FullBox {
  constructor(props) {
    super(DataEntryUrnBox.COMPACT_NAME, props, props.version, DataReferenceBox.encodeFlags(props.flags));
  }

  serialize(buffer, offset=0) {
    //console.log('--- DataEntryUrnBox.serialize enter.');
    var props = this.props,
        name = props.name,
        location = props.location,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeString(name, buffer, base);
    base += Writer.writeString(location, buffer, base);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- DataEntryUrnBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        name, location;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, name] = Reader.readString(buffer, base);
    base += readBytesNum;

    [readBytesNum, location] = Reader.readString(buffer, base);
    base += readBytesNum;

    props.flags = DataReferenceBox.decodeFlags(props.flag);
    props.name = name;
    props.location = location;

    return [base - offset, props];
  }
}

DataEntryUrnBox.COMPACT_NAME = 'urn ';

DataEntryUrnBox.propTypes = {
  version: PropTypes.number,
  flags: PropTypes.object,
  name: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired
};

DataEntryUrnBox.defaultProps = {
  version: 0,
  flags: {inTheSameFile: false}
};

DataEntryUrnBox.spec = {
  container: 'dref',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = DataEntryUrnBox;
