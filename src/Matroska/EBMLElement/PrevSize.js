import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class PrevSize extends TypeUInt {
  constructor(props) {
    super(PrevSize.ELEMENT_ID, PrevSize.COMPACT_NAME, props);
  }
}

PrevSize.COMPACT_NAME = 'PrevSize';

PrevSize.ELEMENT_ID = [0xab];

PrevSize.propTypes = {
  value: PropTypes.number.isRequired
};

PrevSize.spec = {
  container: 'Cluster',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
