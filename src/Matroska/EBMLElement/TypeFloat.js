import Element from './Element';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class TypeFloat extends Element {
  constructor(...params) {
    super(...params);
  }

  serialize(buffer, offset=0) {
    const value = this.props.value;
    const size = 8;

    let base = offset;

    super.setElementSize(size);

    base += super.serialize(buffer, base);
    base += Writer.writeFixedNumber(value, buffer, base, size);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props, value;

    [readBytesNum, props] = Element.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, value] = Reader.readFixedNumber(buffer, base, props.size);
    base += readBytesNum;

    props.value = value;

    return [base - offset, props];
  }
}
