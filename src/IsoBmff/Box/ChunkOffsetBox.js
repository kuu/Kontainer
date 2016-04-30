import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class ChunkOffsetBox extends FullBox {
  constructor(props) {
    super(ChunkOffsetBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- ChunkOffsetBox.serialize enter.');
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

    //console.log(`--- ChunkOffsetBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        entryCount, chunkOffset, entries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    for (let i = 0; i < entryCount; i++) {
      [readBytesNum, chunkOffset] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      entries.push(chunkOffset);
    }

    props.entries = entries;
    return [base - offset, props];
  }
}

ChunkOffsetBox.COMPACT_NAME = 'stco';

ChunkOffsetBox.propTypes = {
  version: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.number)
};

ChunkOffsetBox.defaultProps = {
  version: 0,
  entries: []
};

ChunkOffsetBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
