import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class SoundMediaHeaderBox extends FullBox {
  constructor(props) {
    super(SoundMediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  static validate(context) {
    var trackType = context.currentTrackType;
    if (trackType && trackType !== 'audio') {
      return new Error(`"${SoundMediaHeaderBox.COMPACT_NAME}" box cannot be placed within ${trackType} track.`);
    }
    return null;
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        balance = props.balance,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeFixedNumber(balance, buffer, base, 2);
    base += Writer.writeNumber(0, buffer, base, 2);

    super.setSize(base - offset, buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        balance;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, balance] = Reader.readFixedNumber(buffer, base, 2);
    base += readBytesNum;

    base += 2; // skip reserved

    props.balance = balance;

    return [base - offset, props];
  }
}

SoundMediaHeaderBox.COMPACT_NAME = 'smhd';

SoundMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  balance: PropTypes.number
};

SoundMediaHeaderBox.defaultProps = {
  version: 0,
  balance: 0
};

SoundMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};
