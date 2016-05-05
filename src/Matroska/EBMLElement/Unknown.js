import Element from './Element';
import Buffer from '../../core/Buffer';
import Reader from '../../core/Reader';
import {throwException} from '../../core/Util';

export default function createUnknownElement(id) {
  class Unknown extends Element {
    constructor(props) {
      props.initialSizeLen = 1;
      super(Unknown.ELEMENT_ID, Unknown.COMPACT_NAME, props);
    }

    serialize(buffer, offset=0) {
      const bytes = this.props.value;

      let base = offset;

      super.setElementSize(bytes.length);

      base += super.serialize(buffer, base);

      if (buffer) {
        for (let i = 0; i < bytes.length; i++) {
          buffer[base + i] = bytes[i];
        }
      }
      base += bytes.length;

      return this.size;
    }

    static parse(buffer, offset=0) {
      let base = offset,
          readBytesNum, props, bytes;

      [readBytesNum, props] = Element.parse(buffer, base);
      base += readBytesNum;

      Reader.ASSERT(buffer, base, props.size);

      const buf = new Buffer(props.size);
      const data = buf.getView();

      for (let i = 0; i < props.size; i++) {
        data[i] = buffer[base++];
      }
      props.value = buf.getView();

      return [base - offset, props];
    }
  }

  Unknown.ELEMENT_ID = id;
  Unknown.COMPACT_NAME = `[${id.map(item => Number(item).toString(16)).join(', ')}]`;

  return Unknown;
}
