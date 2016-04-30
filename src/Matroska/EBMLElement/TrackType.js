import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'video':
      return 0x01;
    case 'audio':
      return 0x02;
    case 'complex':
      return 0x03;
    case 'logo':
      return 0x10;
    case 'subtitle':
      return 0x11;
    case 'buttons':
      return 0x12;
    case 'control':
      return 0x20;
  }
  throwException(`Unknow track type: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 0x01:
      return 'video';
    case 0x02:
      return 'audio';
    case 0x03:
      return 'complex';
    case 0x10:
      return 'logo';
    case 0x11:
      return 'subtitle';
    case 0x12:
      return 'buttons';
    case 0x20:
      return 'control';
  }
  throwException(`Unknow track type: (${value})`);
}

export default class TrackType extends TypeUInt {
  constructor(props) {
    super(TrackType.ELEMENT_ID, TrackType.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    const value = this.props.kind;

    let base = offset;

    this.props.value = encodeValue(value);
    base += super.serialize(buffer, base);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props;

    [readBytesNum, props] = TypeUInt.parse(buffer, base);
    base += readBytesNum;

    props.kind = decodeValue(props.value);

    return [base - offset, props];
  }
}

TrackType.COMPACT_NAME = 'TrackType';

TrackType.ELEMENT_ID = [0x83];

TrackType.propTypes = {
  kind: PropTypes.oneOf(['video', 'audio', 'complex', 'logo', 'subtitle', 'buttons', 'control']).isRequired
};

TrackType.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
