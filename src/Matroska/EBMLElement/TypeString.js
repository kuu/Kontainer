import Element from './Element';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';
import {throwException, getUTF8Length} from '../../core/Util';

export default class TypeString extends Element {
  constructor(...params) {
    super(...params);
  }

  static validate(context, props) {
    const maxSizeLength = context.maxSizeLength;
    const size = getUTF8Length(props.value);

    if (maxSizeLength) {
      const sizeLen = Element.getNecessaryBytesNumForSize(size);
      if (sizeLen > maxSizeLength) {
        throwException(`Size field cannot exceed the EBMLMaxSizeLength(${maxSizeLength})`);
      }
    }
  }

  serialize(buffer, offset=0) {
    const value = this.props.value;
    const size = getUTF8Length(value);

    let base = offset;

    super.setElementSize(size);

    base += super.serialize(buffer, base);
    base += Writer.writeString(value, buffer, base, size);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props, value;

    [readBytesNum, props] = Element.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, value] = Reader.readString(buffer, base, props.size);
    base += readBytesNum;

    props.value = value;

    return [base - offset, props];
  }
}
