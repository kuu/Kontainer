import Box from './Box';
import FullBox from './FullBox';
import DataReferenceBox from './DataReferenceBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class DataEntryUrlBox extends FullBox {
  constructor(props) {
    super(DataEntryUrlBox.COMPACT_NAME, props, props.version, DataReferenceBox.encodeFlags(props.flags));
  }

  serialize(buffer, offset=0) {
    //console.log('--- DataEntryUrlBox.serialize enter.');
    const props = this.props;
    const location = props.location;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeString(location, buffer, base);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- DataEntryUrlBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
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
