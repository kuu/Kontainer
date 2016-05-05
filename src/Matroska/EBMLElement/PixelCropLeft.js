import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PixelCropLeft extends TypeUInt {
  constructor(props) {
    super(PixelCropLeft.ELEMENT_ID, PixelCropLeft.COMPACT_NAME, props);
  }
}

PixelCropLeft.COMPACT_NAME = 'PixelCropLeft';

PixelCropLeft.ELEMENT_ID = [0x54, 0xCC];

PixelCropLeft.propTypes = {
  value: PropTypes.number
};

PixelCropLeft.defaultProps = {
  value: 0
};

PixelCropLeft.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
