import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class TrackFragmentBaseMediaDecodeTimeBox extends FullBox {
  constructor(props) {
    super(TrackFragmentBaseMediaDecodeTimeBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- TrackFragmentBaseMediaDecodeTimeBox.serialize enter.');
    const props = this.props;
    const baseMediaDecodeTime = props.baseMediaDecodeTime;

    let base = offset;

    base += super.serialize(buffer, base);
    if (this.version === 1) {
      base += Writer.writeNumber(baseMediaDecodeTime, buffer, base, 8);
    } else {
      base += Writer.writeNumber(baseMediaDecodeTime, buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- TrackFragmentBaseMediaDecodeTimeBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        baseMediaDecodeTime;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    if (props.version === 1) {
      [readBytesNum, baseMediaDecodeTime] = Reader.readNumber(buffer, base, 8);
    } else {
      [readBytesNum, baseMediaDecodeTime] = Reader.readNumber(buffer, base, 4);
    }
    base += readBytesNum;

    props.baseMediaDecodeTime = baseMediaDecodeTime;
    return [base - offset, props];
  }
}

TrackFragmentBaseMediaDecodeTimeBox.COMPACT_NAME = 'tfdt';

TrackFragmentBaseMediaDecodeTimeBox.propTypes = {
  version: PropTypes.number,
  baseMediaDecodeTime: PropTypes.number.isRequired
};

TrackFragmentBaseMediaDecodeTimeBox.defaultProps = {
  version: 0
};

TrackFragmentBaseMediaDecodeTimeBox.spec = {
  container: 'traf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};
