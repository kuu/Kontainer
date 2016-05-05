import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class BlockDuration extends TypeUInt {
  constructor(props) {
    super(BlockDuration.ELEMENT_ID, BlockDuration.COMPACT_NAME, props);
  }
}

BlockDuration.COMPACT_NAME = 'BlockDuration';

BlockDuration.ELEMENT_ID = [0x9b];

BlockDuration.propTypes = {
  value: PropTypes.number.isRequired
};

BlockDuration.spec = {
  container: 'BlockGroup',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
