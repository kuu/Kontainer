import Box from './Box';
import PropTypes from '../../core/PropTypes';
import Buffer from '../../core/Buffer';
import {BufferReadError} from '../../core/Error';

function ASSERT(buffer, offset, bytesToRead) {
  if ((buffer.length - offset) < bytesToRead) {
    throw new BufferReadError();
  }
}

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
        toBeRead, data, buf;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;
    toBeRead = props.size - readBytesNum;

    ASSERT(buffer, base, toBeRead);

    buf = new Buffer(toBeRead);
    data = buf.getView();

    for (let i = 0; i < toBeRead; i++) {
      data[i] = buffer[base++];
    }
    props.data = buf.getView();

    return [base - offset, props];
  }
}

MediaDataBox.COMPACT_NAME = 'mdat';

MediaDataBox.propTypes = {
  data: PropTypes.any.isRequired
};

MediaDataBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};
