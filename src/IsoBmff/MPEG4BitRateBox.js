import Box from './Box';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class MPEG4BitRateBox extends Box {
  constructor(props) {
    super(MPEG4BitRateBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MPEG4BitRateBox.serialize enter.');
    const props = this.props;
    const bufferSizeDB = props.bufferSizeDB;
    const maxBitrate = props.maxBitrate;
    const avgBitrate = props.avgBitrate;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(bufferSizeDB, buffer, base, 4);
    base += Writer.writeNumber(maxBitrate, buffer, base, 4);
    base += Writer.writeNumber(avgBitrate, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MPEG4BitRateBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props,
        bufferSizeDB, maxBitrate, avgBitrate;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, bufferSizeDB] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, maxBitrate] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, avgBitrate] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.bufferSizeDB = bufferSizeDB;
    props.maxBitrate = maxBitrate;
    props.avgBitrate = avgBitrate;

    return [base - offset, props];
  }
}

MPEG4BitRateBox.COMPACT_NAME = 'btrt';

MPEG4BitRateBox.propTypes = {
  bufferSizeDB: PropTypes.number.isRequired,
  maxBitrate: PropTypes.number.isRequired,
  avgBitrate: PropTypes.number.isRequired
};

MPEG4BitRateBox.spec = {
  container: 'avc1',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};
