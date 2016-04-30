import Component from '../../core/Component';
import TypeElementId from './TypeElementId';
import PropTypes from '../../core/PropTypes';

export default class SeekID extends TypeElementId {
  constructor(props) {
    super(SeekID.ELEMENT_ID, SeekID.COMPACT_NAME, props);
  }
}

SeekID.COMPACT_NAME = 'SeekID';

SeekID.ELEMENT_ID = [0x53, 0xab];

SeekID.propTypes = {
  value: PropTypes.string.isRequired
};

SeekID.spec = {
  container: 'Seek',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
