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
        Buffer.wrap(buffer).copyFrom(bytes, 0, bytes.length, base);
      }
      base += bytes.length;

      return this.size;
    }

    static parse(buffer, offset=0) {
      let base = offset,
          readBytesNum, props;

      [readBytesNum, props] = Element.parse(buffer, base);
      base += readBytesNum;

      Reader.ASSERT(buffer, base, props.size);
      const buf = Buffer.wrap(buffer).copy(base, props.size);
      base += props.size;
      props.value = buf.getView();

      return [base - offset, props];
    }
  }

  Unknown.ELEMENT_ID = id;
  Unknown.COMPACT_NAME = `[${id.map(item => Number(item).toString(16)).join(', ')}]`;

  return Unknown;
}
