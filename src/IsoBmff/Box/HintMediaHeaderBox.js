import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';
import {throwException} from '../../core/Util';

export default class HintMediaHeaderBox extends FullBox {
  constructor(props) {
    super(HintMediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  static validate(context) {
    const trackType = context.currentTrackType;
    if (trackType && trackType !== 'hint') {
      throwException(`"${HintMediaHeaderBox.COMPACT_NAME}" box cannot be placed within ${trackType} track.`);
    }
  }

  serialize(buffer, offset=0) {
    const props = this.props;
    const maxPDUSize = props.maxPDUSize;
    const avgPDUSize = props.avgPDUSize;
    const maxBitrate = props.maxBitrate;
    const avgBitrate = props.avgBitrate;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeFixedNumber(maxPDUSize, buffer, base, 2);
    base += Writer.writeFixedNumber(avgPDUSize, buffer, base, 2);
    base += Writer.writeFixedNumber(maxBitrate, buffer, base, 4);
    base += Writer.writeFixedNumber(avgBitrate, buffer, base, 4);
    base += Writer.writeNumber(0, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props,
        maxPDUSize, avgPDUSize,
        maxBitrate, avgBitrate;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, maxPDUSize] = Reader.readFixedNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, avgPDUSize] = Reader.readFixedNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, maxBitrate] = Reader.readFixedNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, avgBitrate] = Reader.readFixedNumber(buffer, base, 4);
    base += readBytesNum;

    base += 4; // skip reserved

    props.maxPDUSize = maxPDUSize;
    props.avgPDUSize = avgPDUSize;
    props.maxBitrate = maxBitrate;
    props.avgBitrate = avgBitrate;

    return [base - offset, props];
  }
}

HintMediaHeaderBox.COMPACT_NAME = 'hmhd';

HintMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  maxPDUSize: PropTypes.number.isRequired,
  avgPDUSize: PropTypes.number.isRequired,
  maxBitrate: PropTypes.number.isRequired,
  avgBitrate: PropTypes.number.isRequired
};

HintMediaHeaderBox.defaultProps = {
  version: 0
};

HintMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
