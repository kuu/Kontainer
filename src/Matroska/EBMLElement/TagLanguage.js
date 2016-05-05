import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class TagLanguage extends TypeString {
  constructor(props) {
    super(TagLanguage.ELEMENT_ID, TagLanguage.COMPACT_NAME, props);
  }
}

TagLanguage.COMPACT_NAME = 'TagLanguage';

TagLanguage.ELEMENT_ID = [0x44, 0x7A];

TagLanguage.propTypes = {
  value: PropTypes.string
};

TagLanguage.defaultProps = {
  value: 'und'
};

TagLanguage.spec = {
  container: 'SimpleTag',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
