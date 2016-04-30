import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class TargetTypeValue extends TypeUInt {
  constructor(props) {
    super(TargetTypeValue.ELEMENT_ID, TargetTypeValue.COMPACT_NAME, props);
  }
}

TargetTypeValue.COMPACT_NAME = 'TargetTypeValue';

TargetTypeValue.ELEMENT_ID = [0x68, 0xCA];

TargetTypeValue.propTypes = {
  value: PropTypes.number
};

TargetTypeValue.defaultProps = {
  value: 0x50
};

TargetTypeValue.spec = {
  container: 'Targets',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
