import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class SyncSampleBox extends FullBox {
  constructor(props) {
    super(SyncSampleBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- SyncSampleBox.serialize enter.');
    const props = this.props;
    const entries = props.entries;
    const entryCount = entries.length;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    for (let i = 0; i < entryCount; i++) {
      base += Writer.writeNumber(entries[i], buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- SyncSampleBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        entryCount, sampleNumber, entries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    for (let i = 0; i < entryCount; i++) {
      [readBytesNum, sampleNumber] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      entries.push(sampleNumber);
    }

    props.entries = entries;

    return [base - offset, props];
  }
}

SyncSampleBox.COMPACT_NAME = 'stss';

SyncSampleBox.propTypes = {
  version: PropTypes.number,
  entries: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired
};

SyncSampleBox.defaultProps = {
  version: 0
};

SyncSampleBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};
