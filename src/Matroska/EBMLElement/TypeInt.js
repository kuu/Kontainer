import Element from './Element';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';
import {throwException} from '../../core/Util';

function getNecessaryBytesNum(value) {
  if (value >= -128 && value < 128) {
    return 1;
  } else if (value >= -32768 && value < 32768) {
    return 2;
  } else if (value >= -8388608 && value < 8388608) {
    return 3;
  } else if (value >= -2147483648 && value < 2147483648) {
    return 4;
  } else if (value >= -549755813888 && value < 549755813888) {
    return 5;
  } else if (value >= -140737488355328 && value < 140737488355328) {
    return 6;
  } else if (value >= -4503599627370496 && value < 4503599627370496) {
    return 7;
  } else {
    throwException(`Matroska.Element.serialize(${value}): largesize(>=2^53) is not supported.`);
  }
}

export default class TypeInt extends Element {
  constructor(...params) {
    super(...params);
  }

  static validate(context, props) {
    const maxSizeLength = context.maxSizeLength;
    if (maxSizeLength) {
      const bytesNum = getNecessaryBytesNum(props.value);
      const sizeLen = Element.getNecessaryBytesNumForSize(bytesNum);
      if (sizeLen > maxSizeLength) {
        throwException(`Size field cannot exceed the EBMLMaxSizeLength(${maxSizeLength})`);
      }
    }
  }

  serialize(buffer, offset=0) {
    const value = this.props.value;
    const size = getNecessaryBytesNum(value);

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

    [readBytesNum, value] = Reader.readNumber(buffer, base, props.size, true);
    base += readBytesNum;

    props.value = value;

    return [base - offset, props];
  }
}
