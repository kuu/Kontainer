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
      for (let i = 0, il = data.length; i < il; i++) {
        buffer[base++] = data[i];
      }
    } else {
      base += data.length;
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MediaDataBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=-1) {
    let base = offset, readBytesNum, props,
        toBeRead, data, buf, byteOffset;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;
    byteOffset = base;
    toBeRead = props.size - readBytesNum;

    Reader.ASSERT(buffer, base, toBeRead);
    buf = new Buffer(toBeRead);
    data = buf.getView();

    for (let i = 0; i < toBeRead; i++) {
      data[i] = buffer[base++];
    }
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
