import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class Title extends TypeString {
  constructor(props) {
    super(Title.ELEMENT_ID, Title.COMPACT_NAME, props);
  }
}

Title.COMPACT_NAME = 'Title';

Title.ELEMENT_ID = [0x7b, 0xa9];

Title.propTypes = {
  value: PropTypes.string.isRequired
};

Title.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_ZERO_OR_ONE,
  mandatoryList: []
};
