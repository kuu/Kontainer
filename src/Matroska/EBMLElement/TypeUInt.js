import Element from './Element';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';
import {throwException} from '../../core/Util';

function getNecessaryBytesNum(value) {
  if (value < 256) {
    return 1;
  } else if (value < 65536) {
    return 2;
  } else if (value < 16777216) {
    return 3;
  } else if (value < 4294967296) {
    return 4;
  } else if (value < 1099511627776) {
    return 5;
  } else if (value < 281474976710656) {
    return 6;
  } else if (value <= Number.MAX_SAFE_INTEGER) {
    return 7;
  } else {
    throwException(`Matroska.Element.serialize(${value}): largesize(>=2^53) is not supported.`);
  }
}

export default class TypeUInt extends Element {
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

    [readBytesNum, value] = Reader.readNumber(buffer, base, props.size);
    base += readBytesNum;

    props.value = value;

    return [base - offset, props];
  }
}
