import Component from '../../core/Component';
import TypeBytes from './TypeBytes';
import PropTypes from '../../core/PropTypes';

export default class TagBinary extends TypeBytes {
  constructor(props) {
    super(TagBinary.ELEMENT_ID, TagBinary.COMPACT_NAME, props);
  }
}

TagBinary.COMPACT_NAME = 'TagBinary';

TagBinary.ELEMENT_ID = [0x44, 0x85];

TagBinary.propTypes = {
  value: PropTypes.any.isRequired
};

TagBinary.spec = {
  container: 'SimpleTag',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
