import Component from '../../core/Component';
import TypeBlock from './TypeBlock';
import PropTypes from '../../core/PropTypes';

export default class Block extends TypeBlock {
  constructor(props) {
    super(Block.ELEMENT_ID, Block.COMPACT_NAME, props);
  }
}

Block.COMPACT_NAME = 'Block';

Block.ELEMENT_ID = [0xa1];

Block.propTypes = {
  trackNumber: PropTypes.number.isRequired,
  timecode: PropTypes.number.isRequired,
  flags: PropTypes.shape({
    invisible: PropTypes.bool,
  }),
  frames: PropTypes.any.isRequired
};

Block.defaultProps = {
  flags: {
    invisible: false,
  }
};

Block.spec = {
  container: 'BlockGroup',
  quantity: Component.QUANTITY_ANY_NUMBER, // QUANTITY_EXACTLY_ONE?
  mandatoryList: []
};
