import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class SampleToChunkBox extends FullBox {
  constructor(props) {
    super(SampleToChunkBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- SampleToChunkBox.serialize enter.');
    const props = this.props;
    const entries = props.entries;
    const entryCount = entries.length;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    for (let i = 0; i < entryCount; i++) {
      base += Writer.writeNumber(entries[i].firstChunk, buffer, base, 4);
      base += Writer.writeNumber(entries[i].samplesPerChunk, buffer, base, 4);
      base += Writer.writeNumber(entries[i].sampleDescriptionIndex, buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- SampleToChunkBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        entryCount, firstChunk, samplesPerChunk,
        sampleDescriptionIndex, entries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    for (let i = 0; i < entryCount; i++) {
      [readBytesNum, firstChunk] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;

      [readBytesNum, samplesPerChunk] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;

      [readBytesNum, sampleDescriptionIndex] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;

      entries.push({
        firstChunk: firstChunk,
        samplesPerChunk: samplesPerChunk,
        sampleDescriptionIndex: sampleDescriptionIndex
      });
    }

    props.entries = entries;
    return [base - offset, props];
  }
}

SampleToChunkBox.COMPACT_NAME = 'stsc';

SampleToChunkBox.propTypes = {
  version: PropTypes.number,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      firstChunk: PropTypes.number,
      samplesPerChunk: PropTypes.number,
      sampleDescriptionIndex: PropTypes.number
    })
  )
};

SampleToChunkBox.defaultProps = {
  version: 0,
  entries: []
};

SampleToChunkBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
