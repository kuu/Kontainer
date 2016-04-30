import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class SampleSizeBox extends FullBox {
  constructor(props) {
    super(SampleSizeBox.COMPACT_NAME, props, 0, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- SampleSizeBox.serialize enter.');
    const props = this.props;
    const sampleSize = props.sampleSize;
    const sampleSizeEntries = props.sampleSizeEntries;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(sampleSize, buffer, base, 4);
    base += Writer.writeNumber(sampleSizeEntries.length, buffer, base, 4);

    for (let i = 0, il = sampleSizeEntries.length; i < il; i++) {
      base += Writer.writeNumber(sampleSizeEntries[i], buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- SampleSizeBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        sampleSize, sampleCount,
        entrySize, sampleSizeEntries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, sampleSize] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, sampleCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    if (sampleSize === 0) {
      for (let i = 0; i < sampleCount; i++) {
        [readBytesNum, entrySize] = Reader.readNumber(buffer, base, 4);
        base += readBytesNum;
        sampleSizeEntries.push(entrySize);
      }
    }

    props.sampleSize = sampleSize;
    props.sampleSizeEntries = sampleSizeEntries;

    return [base - offset, props];
  }
}

SampleSizeBox.COMPACT_NAME = 'stsz';

SampleSizeBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  sampleSize: PropTypes.number,
  sampleSizeEntries: PropTypes.arrayOf(PropTypes.number)
};

SampleSizeBox.defaultProps = {
  version: 0,
  sampleSize: 0,
  sampleSizeEntries: []
};

SampleSizeBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
