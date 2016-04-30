import Component from '../../core/Component';
import TypeFloat from './TypeFloat';
import PropTypes from '../../core/PropTypes';

export default class Duration extends TypeFloat {
  constructor(props) {
    super(Duration.ELEMENT_ID, Duration.COMPACT_NAME, props);
  }
}

Duration.COMPACT_NAME = 'Duration';

Duration.ELEMENT_ID = [0x44, 0x89];

Duration.propTypes = {
  value: PropTypes.number.isRequired
};

Duration.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_ZERO_OR_ONE,
  mandatoryList: []
};
