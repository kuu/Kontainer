import Component from '../../core/Component';
import TypeBytes from './TypeBytes';
import PropTypes from '../../core/PropTypes';

export default class Void extends TypeBytes {
  constructor(props) {
    super(Void.ELEMENT_ID, Void.COMPACT_NAME, props);
  }
}

Void.COMPACT_NAME = 'Void';

Void.ELEMENT_ID = [0xEC];

Void.propTypes = {
  value: PropTypes.any.isRequired
};

Void.spec = {
  container: '*',
  quantity: Component.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
