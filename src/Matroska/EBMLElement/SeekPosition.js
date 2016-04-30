import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class SeekPosition extends TypeUInt {
  constructor(props) {
    super(SeekPosition.ELEMENT_ID, SeekPosition.COMPACT_NAME, props);
  }
}

SeekPosition.COMPACT_NAME = 'SeekPosition';

SeekPosition.ELEMENT_ID = [0x53, 0xac];

SeekPosition.propTypes = {
  value: PropTypes.number.isRequired
};

SeekPosition.spec = {
  container: 'Seek',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
