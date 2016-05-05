import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class DisplayWidth extends TypeUInt {
  constructor(props) {
    super(DisplayWidth.ELEMENT_ID, DisplayWidth.COMPACT_NAME, props);
  }
}

DisplayWidth.COMPACT_NAME = 'DisplayWidth';

DisplayWidth.ELEMENT_ID = [0x54, 0xB0];

DisplayWidth.propTypes = {
  value: PropTypes.number.isRequired
};

DisplayWidth.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
