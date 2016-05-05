import Component from '../../core/Component';
import TypeBlock from './TypeBlock';
import PropTypes from '../../core/PropTypes';

export default class SimpleBlock extends TypeBlock {
  constructor(props) {
    super(SimpleBlock.ELEMENT_ID, SimpleBlock.COMPACT_NAME, props);
  }
}

SimpleBlock.COMPACT_NAME = 'SimpleBlock';

SimpleBlock.ELEMENT_ID = [0xa3];

SimpleBlock.propTypes = {
  trackNumber: PropTypes.number.isRequired,
  timecode: PropTypes.number.isRequired,
  flags: PropTypes.shape({
    keyframe: PropTypes.bool,
    invisible: PropTypes.bool,
    discardable:  PropTypes.bool
  }),
  frames: PropTypes.any.isRequired
};

SimpleBlock.defaultProps = {
  flags: {
    keyframe: false,
    invisible: false,
    discardable:  false
  }
};

SimpleBlock.spec = {
  container: 'Cluster',
  quantity: Component.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
