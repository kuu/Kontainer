import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class TargetType extends TypeString {
  constructor(props) {
    super(TargetType.ELEMENT_ID, TargetType.COMPACT_NAME, props);
  }
}

TargetType.COMPACT_NAME = 'TargetType';

TargetType.ELEMENT_ID = [0x63, 0xCA];

TargetType.propTypes = {
  value: PropTypes.string.isRequired
};

TargetType.spec = {
  container: 'Targets',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
