import Component from '../../core/Component';
import TypeInt from './TypeInt';
import PropTypes from '../../core/PropTypes';

export default class ReferenceBlock extends TypeInt {
  constructor(props) {
    super(ReferenceBlock.ELEMENT_ID, ReferenceBlock.COMPACT_NAME, props);
  }
}

ReferenceBlock.COMPACT_NAME = 'ReferenceBlock';

ReferenceBlock.ELEMENT_ID = [0xfb];

ReferenceBlock.propTypes = {
  value: PropTypes.number.isRequired
};

ReferenceBlock.spec = {
  container: 'BlockGroup',
  quantity: Component.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
