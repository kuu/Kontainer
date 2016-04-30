import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PixelCropRight extends TypeUInt {
  constructor(props) {
    super(PixelCropRight.ELEMENT_ID, PixelCropRight.COMPACT_NAME, props);
  }
}

PixelCropRight.COMPACT_NAME = 'PixelCropRight';

PixelCropRight.ELEMENT_ID = [0x54, 0xDD];

PixelCropRight.propTypes = {
  value: PropTypes.number
};

PixelCropRight.defaultProps = {
  value: 0
};

PixelCropRight.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
