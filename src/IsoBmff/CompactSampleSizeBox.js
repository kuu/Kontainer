import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class CompactSampleSizeBox extends FullBox {
  constructor(props) {
    super(CompactSampleSizeBox.COMPACT_NAME, props, 0, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- CompactSampleSizeBox.serialize enter.');
    const props = this.props;
    const fieldSize = props.fieldSize;
    const sampleSizeEntries = props.sampleSizeEntries;

    let base = offset, num;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(0, buffer, base, 3); // reserved(24)
    base += Writer.writeNumber(fieldSize, buffer, base, 1);
    base += Writer.writeNumber(sampleSizeEntries.length, buffer, base, 4);

    for (let i = 0, il = sampleSizeEntries.length; i < il; i++) {
      if (fieldSize === 4) {
        if (i % 2 === 0) {
          num = (sampleSizeEntries[i] & 0x0F) << 4;
          if (i === il - 1) {
            base += Writer.writeNumber(num, buffer, base, 1);
          }
        } else {
          num |= (sampleSizeEntries[i] & 0x0F);
          base += Writer.writeNumber(num, buffer, base, 1);
        }
      } else {
        base += Writer.writeNumber(sampleSizeEntries[i], buffer, base, fieldSize / 8);
      }
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- CompactSampleSizeBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        fieldSize, sampleCount,
        entrySize, sampleSizeEntries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    base += 3; // skip reserved

    [readBytesNum, fieldSize] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    if (fieldSize !== 4 && fieldSize !== 8 && fieldSize !== 16) {
      fieldSize = 8;
    }

    [readBytesNum, sampleCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    for (let i = 0; i < sampleCount; i++) {
      if (fieldSize === 4) {
        if (i % 2 === 0) {
          [readBytesNum, entrySize] = Reader.readNumber(buffer, base, 1);
          base += readBytesNum;
          sampleSizeEntries.push((entrySize >>> 4) & 0x0F);
          if (i !== sampleCount - 1) {
            sampleSizeEntries.push(entrySize & 0x0F);
          }
        }
      } else {
        [readBytesNum, entrySize] = Reader.readNumber(buffer, base, fieldSize / 8);
        base += readBytesNum;
        sampleSizeEntries.push(entrySize);
      }
    }

    props.fieldSize = fieldSize;
    props.sampleSizeEntries = sampleSizeEntries;

    return [base - offset, props];
  }
}

CompactSampleSizeBox.COMPACT_NAME = 'stz2';

CompactSampleSizeBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  fieldSize: PropTypes.oneOf([4, 8, 16]),
  sampleSizeEntries: PropTypes.arrayOf(PropTypes.number)
};

CompactSampleSizeBox.defaultProps = {
  version: 0,
  fieldSize: 8,
  sampleSizeEntries: []
};

CompactSampleSizeBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};
