import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PixelWidth extends TypeUInt {
  constructor(props) {
    super(PixelWidth.ELEMENT_ID, PixelWidth.COMPACT_NAME, props);
  }
}

PixelWidth.COMPACT_NAME = 'PixelWidth';

PixelWidth.ELEMENT_ID = [0xB0];

PixelWidth.propTypes = {
  value: PropTypes.number.isRequired
};

PixelWidth.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
