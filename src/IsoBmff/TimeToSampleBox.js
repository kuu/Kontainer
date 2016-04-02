import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class TimeToSampleBox extends FullBox {
  constructor(props) {
    super(TimeToSampleBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- TimeToSampleBox.serialize enter.');
    var props = this.props,
        entries = props.entries,
        entryCount = entries.length,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    for (var i = 0; i < entryCount; i++) {
      base += Writer.writeNumber(entries[i].sampleCount, buffer, base, 4);
      base += Writer.writeNumber(entries[i].sampleDelta, buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- TimeToSampleBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        entryCount, sampleCount, sampleDelta,
        entries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    for (var i = 0; i < entryCount; i++) {
      [readBytesNum, sampleCount] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;

      [readBytesNum, sampleDelta] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;

      entries.push({
        sampleCount: sampleCount,
        sampleDelta: sampleDelta
      });
    }

    props.entries = entries;

    return [base - offset, props];
  }
}

TimeToSampleBox.COMPACT_NAME = 'stts';

TimeToSampleBox.propTypes = {
  version: PropTypes.number,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      sampleCount: PropTypes.number,
      sampleDelta: PropTypes.number
    })
  ).isRequired
};

TimeToSampleBox.defaultProps = {
  version: 0
};

TimeToSampleBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};
