import Component from '../../core/Component';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class Box extends Component {
  constructor(type, props) {
    super(type, props);
    this.size = 0;
  }

  serialize(buffer, offset=0) {
    //console.log('--- Box.serialize enter.');
    const size = this.size;
    const type = this.type;

    let base = offset;

    if (size < 4294967296) {
      base += Writer.writeNumber(size, buffer, base, 4);
    } else {
      console.error('IsoBmff.Box.serialize: largesize(>4GB) is not supported.');
      return 0;
    }

    base += Writer.writeString(type, buffer, base, 4);

    if (type === 'uuid') {
      base += Writer.writeString(this.props.extendedType, buffer, base, 16);
    }

    this.size = base - offset;

    //console.log(`--- Box.serialize exit. size=${this.size}`);
    return this.size;
  }

  getSize() {
    return this.size;
  }

  setSize(size, buffer, offset=0) {
    if (size < 4294967296) {
      Writer.writeNumber(size, buffer, offset, 4);
    } else {
      console.error('IsoBmff.Box.serialize: largesize(>4GB) is not supported.');
      return 0;
    }
    this.size = size;
  }

  // Parses buffer and returns props.
  static parse(buffer, offset=0) {
    const LENGTH = buffer.length;

    let size;
    let type;
    let extendedType;
    let base = offset;
    let readNum;

    // Read size.
    [readNum, size] = Reader.readNumber(buffer, base, 4);
    base += readNum;
    // Read boxType.
    [readNum, type] = Reader.readString(buffer, base, 4);
    base += readNum;

    if (size === 0) {
      // box extends to end of file
      void 0;
    } else if (size === 1) {
      // 64bit largesize
      [readNum, size] = Reader.readNumber(buffer, base, 8);
      base += readNum;
    }

    if (type === 'uuid') {
      [readNum, extendedType] = Reader.readString(buffer, base, 16);
      base += 16;
    }

    return [base - offset, {
      size,
      type,
      extendedType,
    }];
  }
}

Box.QUANTITY_ANY_NUMBER = 0;
Box.QUANTITY_EXACTLY_ONE = 1;
Box.QUANTITY_ZERO_OR_ONE = 2;
