import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class Channels extends TypeUInt {
  constructor(props) {
    super(Channels.ELEMENT_ID, Channels.COMPACT_NAME, props);
  }
}

Channels.COMPACT_NAME = 'Channels';

Channels.ELEMENT_ID = [0x9F];

Channels.propTypes = {
  value: PropTypes.number
};

Channels.defaultProps = {
  value: 1
};

Channels.spec = {
  container: 'Audio',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
