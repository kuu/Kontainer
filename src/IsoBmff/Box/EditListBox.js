import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class EditListBox extends FullBox {
  constructor(props) {
    super(EditListBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- EditListBox.serialize enter.');
    const props = this.props;
    const entries = props.entries;
    const bytesToWrite = this.version === 1 ? 8 : 4;

    let base = offset;

    base += super.serialize(buffer, base);

    base += Writer.writeNumber(entries.length, buffer, base, 4); // entry_count (32)
    entries.forEach((entry) => {
      base += Writer.writeNumber(entry.segmentDuration, buffer, base, bytesToWrite); // segment_duration (32/64)
      base += Writer.writeNumber(entry.mediaTime, buffer, base, bytesToWrite); //  media_time (32/64)
      base += Writer.writeNumber(entry.mediaRate, buffer, base, 2); // media_rate_integer (16)
      base += Writer.writeNumber(0, buffer, base, 2); // media_rate_fraction=0 (16)
    });

    super.setSize(base - offset, buffer, offset);

    //console.log('--- EditListBox.serialize exit.');
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        entryCount, segmentDuration, mediaTime, mediaRate;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    const version = props.version;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4); // entry_count (32)
    base += readBytesNum;

    const entries = Array.from({length: entryCount}, () => {return {segmentDuration: 0, mediaTime: 0, mediaRate: 0};});
    const bytesToBeRead = props.version === 1 ? 8 : 4;

    entries.forEach(entry => {
      [readBytesNum, entry.segmentDuration] = Reader.readNumber(buffer, base, bytesToBeRead); // segment_duration (32/64)
      base += readBytesNum;

      [readBytesNum, entry.mediaTime] = Reader.readNumber(buffer, base, bytesToBeRead, true); //  media_time (32/64)
      base += readBytesNum;

      [readBytesNum, entry.mediaRate] = Reader.readNumber(buffer, base, 2); // media_rate_integer(16)
      base += readBytesNum;

      base += 2; // skip media_rate_fraction=0 (16)
    });

    props.entries = entries;

    return [base - offset, props];
  }
}

EditListBox.COMPACT_NAME = 'elst';

EditListBox.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      segmentDuration: PropTypes.number,
      mediaTime: PropTypes.number,
      mediaRate: PropTypes.number
    }).isRequired
  )
};

EditListBox.spec = {
  container: 'edts',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
