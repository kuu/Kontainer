import Element from './Element';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

const DIFF_UNIXTIME_AND_MILLENNIUM = 978307200000; // msec

export default class TypeDate extends Element {
  constructor(...params) {
    super(...params);
  }

  serialize(buffer, offset=0) {
    const date = this.props.value;
    const sinceMillenium = date.getTime() - DIFF_UNIXTIME_AND_MILLENNIUM; // msec
    const value = sinceMillenium * 1000000; // nanosec
    const size = 8;

    let base = offset;

    super.setElementSize(size);

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(value, buffer, base, size);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props, value;

    [readBytesNum, props] = Element.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, value] = Reader.readNumber(buffer, base, props.size, true, false);
    base += readBytesNum;

    const sinceMillenium = Math.floor(value / 1000000); // msec
    const date = new Date(sinceMillenium + DIFF_UNIXTIME_AND_MILLENNIUM);

    props.value = date;

    return [base - offset, props];
  }
}
