import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PixelCropTop extends TypeUInt {
  constructor(props) {
    super(PixelCropTop.ELEMENT_ID, PixelCropTop.COMPACT_NAME, props);
  }
}

PixelCropTop.COMPACT_NAME = 'PixelCropTop';

PixelCropTop.ELEMENT_ID = [0x54, 0xBB];

PixelCropTop.propTypes = {
  value: PropTypes.number
};

PixelCropTop.defaultProps = {
  value: 0
};

PixelCropTop.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
