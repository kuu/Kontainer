import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PixelHeight extends TypeUInt {
  constructor(props) {
    super(PixelHeight.ELEMENT_ID, PixelHeight.COMPACT_NAME, props);
  }
}

PixelHeight.COMPACT_NAME = 'PixelHeight';

PixelHeight.ELEMENT_ID = [0xBA];

PixelHeight.propTypes = {
  value: PropTypes.number.isRequired
};

PixelHeight.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
