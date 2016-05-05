import Element from './Element';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class TypeBool extends Element {
  constructor(...params) {
    super(...params);
  }

  serialize(buffer, offset=0) {
    const value = this.props.value ? 1 : 0;

    let base = offset;

    super.setElementSize(1);

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(value, buffer, base, 1);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props, value;

    [readBytesNum, props] = Element.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, value] = Reader.readNumber(buffer, base, props.size);
    base += readBytesNum;

    props.value = !!value;

    return [base - offset, props];
  }
}
