import Component from '../../core/Component';
import TypeInt from './TypeInt';
import PropTypes from '../../core/PropTypes';

export default class DiscardPadding extends TypeInt {
  constructor(props) {
    super(DiscardPadding.ELEMENT_ID, DiscardPadding.COMPACT_NAME, props);
  }
}

DiscardPadding.COMPACT_NAME = 'DiscardPadding';

DiscardPadding.ELEMENT_ID = [0x75, 0xa2];

DiscardPadding.propTypes = {
  value: PropTypes.number.isRequired
};

DiscardPadding.spec = {
  container: 'BlockGroup',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
