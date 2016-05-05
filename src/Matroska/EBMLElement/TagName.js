import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class TagName extends TypeString {
  constructor(props) {
    super(TagName.ELEMENT_ID, TagName.COMPACT_NAME, props);
  }
}

TagName.COMPACT_NAME = 'TagName';

TagName.ELEMENT_ID = [0x45, 0xA3];

TagName.propTypes = {
  value: PropTypes.string.isRequired
};

TagName.spec = {
  container: 'SimpleTag',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
