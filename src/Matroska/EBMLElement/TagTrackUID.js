import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class TagTrackUID extends TypeUInt {
  constructor(props) {
    super(TagTrackUID.ELEMENT_ID, TagTrackUID.COMPACT_NAME, props);
  }
}

TagTrackUID.COMPACT_NAME = 'TagTrackUID';

TagTrackUID.ELEMENT_ID = [0x63, 0xC5];

TagTrackUID.propTypes = {
  value: PropTypes.number
};

TagTrackUID.defaultProps = {
  value: 0
};

TagTrackUID.spec = {
  container: 'Targets',
  quantity: Component.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
