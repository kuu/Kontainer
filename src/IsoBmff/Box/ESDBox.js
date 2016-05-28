import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Buffer from '../../core/Buffer';
import Reader from '../../core/Reader';

export default class ESDBox extends FullBox {
  constructor(props) {
    super(ESDBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- ESDBox.serialize enter.');
    const props = this.props;
    const esDescriptor = props.esDescriptor;

    let base = offset;

    base += super.serialize(buffer, base);

    if (buffer) {
      Buffer.wrap(buffer).copyFrom(esDescriptor, 0, esDescriptor.length, base);
    }
    base += esDescriptor.length;

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- ESDBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;
    const toBeRead = props.size - readBytesNum;
    Reader.ASSERT(buffer, base, toBeRead);
    const buf = Buffer.wrap(buffer).copy(base, toBeRead);
    base += toBeRead;
    props.esDescriptor = buf.getData();
    return [base - offset, props];
  }
}

ESDBox.COMPACT_NAME = 'esds';

ESDBox.propTypes = {
  version: PropTypes.number,
  esDescriptor: PropTypes.any.isRequired
};

ESDBox.defaultProps = {
  version: 0
};

ESDBox.spec = {
  container: ['mp4v', 'mp4a', 'mp4s'],
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
