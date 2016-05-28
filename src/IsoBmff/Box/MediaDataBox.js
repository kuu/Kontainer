import Box from './Box';
import PropTypes from '../../core/PropTypes';
import Buffer from '../../core/Buffer';
import Reader from '../../core/Reader';

export default class MediaDataBox extends Box {
  constructor(props) {
    super(MediaDataBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MediaDataBox.serialize enter.');
    const data = this.props.data;

    let base = offset;

    base += super.serialize(buffer, base);

    if (buffer) {
      Buffer.wrap(buffer).copyFrom(data, 0, data.length, base);
    }
    base += data.length;

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MediaDataBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=-1) {
    let base = offset, readBytesNum, props;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;

    const byteOffset = base;

    const toBeRead = props.size - readBytesNum;
    Reader.ASSERT(buffer, base, toBeRead);
    const buf = Buffer.wrap(buffer).copy(base, toBeRead);
    base += toBeRead;

    props.data = buf.getView();
    props.byteOffset = byteOffset;

    return [base - offset, props];
  }
}

MediaDataBox.COMPACT_NAME = 'mdat';

MediaDataBox.propTypes = {
  byteOffset: PropTypes.number,
  data: PropTypes.any.isRequired
};

MediaDataBox.defaultProps = {
  byteOffset: 0
};

MediaDataBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
