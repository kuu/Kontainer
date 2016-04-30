import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'pixels':
      return 0;
    case 'centimeters':
      return 1;
    case 'inches':
      return 2;
    case 'aspectRatio':
      return 3;
  }
  throwException(`Unknow display unit: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 0:
      return 'pixels';
    case 1:
      return 'centimeters';
    case 2:
      return 'inches';
    case 3:
      return 'aspectRatio';
  }
  throwException(`Unknow display unit: (${value})`);
}

export default class DisplayUnit extends TypeUInt {
  constructor(props) {
    super(DisplayUnit.ELEMENT_ID, DisplayUnit.COMPACT_NAME, props);
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

DisplayUnit.COMPACT_NAME = 'DisplayUnit';

DisplayUnit.ELEMENT_ID = [0x54, 0xB2];

DisplayUnit.propTypes = {
  kind: PropTypes.oneOf(['pixels', 'centimeters', 'inches', 'aspectRatio'])
};

DisplayUnit.defaultProps = {
  kind: 'pixels'
};

DisplayUnit.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
