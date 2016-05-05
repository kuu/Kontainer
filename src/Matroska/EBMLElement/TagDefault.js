import Component from '../../core/Component';
import TypeBool from './TypeBool';
import PropTypes from '../../core/PropTypes';

export default class TagDefault extends TypeBool {
  constructor(props) {
    super(TagDefault.ELEMENT_ID, TagDefault.COMPACT_NAME, props);
  }
}

TagDefault.COMPACT_NAME = 'TagDefault';

TagDefault.ELEMENT_ID = [0x44, 0x84];

TagDefault.propTypes = {
  value: PropTypes.bool
};

TagDefault.defaultProps = {
  value: true
};

TagDefault.spec = {
  container: 'SimpleTag',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
