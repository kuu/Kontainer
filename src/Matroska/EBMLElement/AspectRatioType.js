import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'resize':
      return 0;
    case 'keep':
      return 1;
    case 'fixed':
      return 2;
  }
  throwException(`Unknow aspect ration type: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 0:
      return 'resize';
    case 1:
      return 'keep';
    case 2:
      return 'fixed';
  }
  throwException(`Unknow aspect ration type: (${value})`);
}

export default class AspectRatioType extends TypeUInt {
  constructor(props) {
    super(AspectRatioType.ELEMENT_ID, AspectRatioType.COMPACT_NAME, props);
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

AspectRatioType.COMPACT_NAME = 'AspectRatioType';

AspectRatioType.ELEMENT_ID = [0x54, 0xB3];

AspectRatioType.propTypes = {
  kind: PropTypes.oneOf(['resize', 'keep', 'fixed'])
};

AspectRatioType.defaultProps = {
  kind: 'resize'
};

AspectRatioType.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
