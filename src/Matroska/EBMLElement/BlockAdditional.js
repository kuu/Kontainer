import Component from '../../core/Component';
import TypeBytes from './TypeBytes';
import PropTypes from '../../core/PropTypes';

export default class BlockAdditional extends TypeBytes {
  constructor(props) {
    super(BlockAdditional.ELEMENT_ID, BlockAdditional.COMPACT_NAME, props);
  }
}

BlockAdditional.COMPACT_NAME = 'BlockAdditional';

BlockAdditional.ELEMENT_ID = [0xa5];

BlockAdditional.propTypes = {
  value: PropTypes.any.isRequired
};

BlockAdditional.spec = {
  container: 'BlockMore',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
