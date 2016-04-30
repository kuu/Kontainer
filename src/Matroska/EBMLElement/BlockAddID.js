import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class BlockAddID extends TypeUInt {
  constructor(props) {
    super(BlockAddID.ELEMENT_ID, BlockAddID.COMPACT_NAME, props);
  }
}

BlockAddID.COMPACT_NAME = 'BlockAddID';

BlockAddID.ELEMENT_ID = [0xee];

BlockAddID.propTypes = {
  value: PropTypes.number
};

BlockAddID.defaultProps = {
  value: 1
};

BlockAddID.spec = {
  container: 'BlockMore',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
