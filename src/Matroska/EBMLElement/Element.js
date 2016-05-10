import Component from '../../core/Component';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';
import {throwException} from '../../core/Util';

function getElementIdLength(buffer, offset) {
  const firstByte = buffer[offset];
  for (let i = 1; i < 5; i++) {
    if ((firstByte >>> (8 - i)) & 0x01) {
      return i;
    }
  }
  throwException('Invalid Element id');
}

function writeMaskedSize(size, buffer, offset, sizeLen, len) {
  let msb = size >>> ((len - 1) * 8);

  msb &= (0xFF >>> sizeLen);
  msb |= (0x01 << (8 - sizeLen));
  let maskedSize = 0;
  for (let i = 1; i <= len; i++) {
    if (i === 1) {
      maskedSize = msb;
    } else {
      maskedSize <<= 8;
      maskedSize |= ((size >>> ((len - i) * 8)) & 0xFF);
    }
  }
  return Writer.writeNumber(maskedSize, buffer, offset, len);
}

function checkUnknownSize(buffer, offset, length) {
  for (let i = 0; i < length; i++) {
    const byte = buffer[offset + i];

    if (i === 0) {
      if (byte !== (~(0xFF << 8 - length) & 0xFF)) {
        return false;
      }
    } else {
      if (byte !== 0xFF) {
        return false;
      }
    }
  }
  return true;
}

export default class Element extends Component {
  constructor(id, name, props) {
    super(name, props);
    this.id = id;
    this.size = 0;
    this.sizeLen = props.initialSizeLen || 0;
  }

  serialize(buffer, offset=0) {
    //console.log(`--- Element.serialize enter. type=${this.type}`);
    const elementId = this.id;

    let base = offset;
    let writtenBytesNum;

    if (buffer) {
      for (let i = 0; i < elementId.length; i++) {
        buffer[base + i] = elementId[i];
      }
    }

    base += elementId.length;

    const sizeLen = this.sizeLen;
    const size = this.size - elementId.length - sizeLen;

    base += Element.writeElementSize(size, buffer, base, sizeLen);

    //console.log(`--- Element.serialize exit. type=${this.type}, size=${base - offset}`);
    return base - offset;
  }

  static readElementId(buffer, offset) {
    const len = getElementIdLength(buffer, offset);
    Reader.ASSERT(buffer, offset, len);
    const elementId = [];
    for (let i = 0; i < len; i++) {
      elementId.push(buffer[offset + i]);
    }
    return [len, elementId];
  }

  static readElementSize(buffer, offset) {
    const msb = buffer[offset];
    for (let i = 1; i <= 8; i++) {
      if ((msb >>> 8 - i) & 0x01) { // search the most left 1 bit
        Reader.ASSERT(buffer, offset, i);

        buffer[offset] &= (0xFF >>> i); // drop left i bits

        if (checkUnknownSize(buffer, offset, i)) {
          // the size is encoded to all 1's, which indicates that the size of the Element is unknown
          buffer[offset] = msb; // restore
          return [i, -1];
        }
        const [readBytesNum, size] = Reader.readNumber(buffer, offset, i);
        buffer[offset] = msb; // restore
        return [readBytesNum, size];
      }
    }
    throwException('Invalid Element size');
  }

  static writeElementSize(size, buffer, offset, sizeLen) {
    let base = offset;

    if (sizeLen > 4) {
      const left = size / 4294967296;
      const right = size % 4294967296;

      base += writeMaskedSize(left, buffer, base, sizeLen, sizeLen - 4)
      base += Writer.writeNumber(right, buffer, base, 4);
    } else {
      base += writeMaskedSize(size, buffer, base, sizeLen, sizeLen)
    }
    return base - offset;
  }

  static getNecessaryBytesNumForSize(value) {
    let bytesNum = 0;

    if (value < (1 << 7) - 1) {
      bytesNum = 1;
    } else if (value < (1 << 14) - 1) {
      bytesNum = 2;
    } else if (value < (1 << 21) - 1) {
      bytesNum = 3;
    } else if (value < (1 << 28) - 1) {
      bytesNum = 4;
    } else if (value < (1 << 35) - 1) {
      bytesNum = 5;
    } else if (value < (1 << 42) - 1) {
      bytesNum = 6;
    } else if (value < (1 << 49) - 1) {
      bytesNum = 7;
    } else if (value <= Math.MAX_SAFE_INTEGER) {
      bytesNum = 8;
    } else {
      throwException(`Matroska.Element.serialize(${value}): largesize(>=2^53) is not supported.`);
    }
    return bytesNum;
  }

  getSize() {
    return this.size;
  }

  setSize(size) {
    if (this.size === 0) {
      // For master elements.
      this.size = size;
    }
  }

  setElementSize(size) {
    this.sizeLen = Element.getNecessaryBytesNumForSize(size);
    this.size = size + this.id.length + this.sizeLen;
  }

  // Parses buffer and returns props.
  static parse(buffer, offset=0) {
    let size;
    let elementId;
    let base = offset;
    let readBytesNum;

    [readBytesNum, elementId] = Element.readElementId(buffer, base);
    base += readBytesNum;

    [readBytesNum, size] = Element.readElementSize(buffer, base);
    base += readBytesNum;

    return [base - offset, {
      size,
      elementId
    }];
  }
}
