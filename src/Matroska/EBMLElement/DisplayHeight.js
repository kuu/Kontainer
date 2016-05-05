import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class DisplayHeight extends TypeUInt {
  constructor(props) {
    super(DisplayHeight.ELEMENT_ID, DisplayHeight.COMPACT_NAME, props);
  }
}

DisplayHeight.COMPACT_NAME = 'DisplayHeight';

DisplayHeight.ELEMENT_ID = [0x54, 0xBA];

DisplayHeight.propTypes = {
  value: PropTypes.number.isRequired
};

DisplayHeight.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
