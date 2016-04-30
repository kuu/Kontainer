import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class TagString extends TypeString {
  constructor(props) {
    super(TagString.ELEMENT_ID, TagString.COMPACT_NAME, props);
  }
}

TagString.COMPACT_NAME = 'TagString';

TagString.ELEMENT_ID = [0x44, 0x87];

TagString.propTypes = {
  value: PropTypes.string.isRequired
};

TagString.spec = {
  container: 'SimpleTag',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
