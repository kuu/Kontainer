import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PixelCropBottom extends TypeUInt {
  constructor(props) {
    super(PixelCropBottom.ELEMENT_ID, PixelCropBottom.COMPACT_NAME, props);
  }
}

PixelCropBottom.COMPACT_NAME = 'PixelCropBottom';

PixelCropBottom.ELEMENT_ID = [0x54, 0xAA];

PixelCropBottom.propTypes = {
  value: PropTypes.number
};

PixelCropBottom.defaultProps = {
  value: 0
};

PixelCropBottom.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
