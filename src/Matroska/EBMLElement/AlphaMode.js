import Component from '../../core/Component';
import TypeBool from './TypeBool';
import PropTypes from '../../core/PropTypes';

export default class AlphaMode extends TypeBool {
  constructor(props) {
    super(AlphaMode.ELEMENT_ID, AlphaMode.COMPACT_NAME, props);
  }
}

AlphaMode.COMPACT_NAME = 'AlphaMode';

AlphaMode.ELEMENT_ID = [0x53, 0xC0];

AlphaMode.propTypes = {
  value: PropTypes.bool
};

AlphaMode.defaultProps = {
  value: false
};

AlphaMode.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
