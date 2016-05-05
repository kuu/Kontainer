import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class ContentEncodingOrder extends TypeUInt {
  constructor(props) {
    super(ContentEncodingOrder.ELEMENT_ID, ContentEncodingOrder.COMPACT_NAME, props);
  }
}

ContentEncodingOrder.COMPACT_NAME = 'ContentEncodingOrder';

ContentEncodingOrder.ELEMENT_ID = [0x50, 0x31];

ContentEncodingOrder.propTypes = {
  value: PropTypes.number
};

ContentEncodingOrder.defaultProps = {
  value: 0
};

ContentEncodingOrder.spec = {
  container: 'ContentEncoding',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
