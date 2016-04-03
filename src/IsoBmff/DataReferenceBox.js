import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class DataReferenceBox extends FullBox {
  constructor(props) {
    super(DataReferenceBox.COMPACT_NAME, props, props.version, 0);
  }

  static encodeFlags(flags) {
    let f = 0;
    if (flags && flags.inTheSameFile) {
      f |= 0x01;
    }
    return f;
  }

  static decodeFlags(f) {
    const flags = {
      inTheSameFile: false
    };

    if (f & 0x01) {
      flags.inTheSameFile = true;
    }
    return flags;
  }

  serialize(buffer, offset=0) {
    //console.log('--- DataReferenceBox.serialize enter.');
    const props = this.props;
    const entryCount = props.entryCount;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- DataReferenceBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
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
