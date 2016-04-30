import Component from '../../core/Component';
import TypeBytes from './TypeBytes';
import PropTypes from '../../core/PropTypes';

export default class ContentEncKeyID extends TypeBytes {
  constructor(props) {
    super(ContentEncKeyID.ELEMENT_ID, ContentEncKeyID.COMPACT_NAME, props);
  }
}

ContentEncKeyID.COMPACT_NAME = 'ContentEncKeyID';

ContentEncKeyID.ELEMENT_ID = [0x47, 0xE2];

ContentEncKeyID.propTypes = {
  value: PropTypes.any.isRequired
};

ContentEncKeyID.spec = {
  container: 'ContentEncryption',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
