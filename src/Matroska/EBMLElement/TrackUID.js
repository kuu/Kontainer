import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class TrackUID extends TypeUInt {
  constructor(props) {
    super(TrackUID.ELEMENT_ID, TrackUID.COMPACT_NAME, props);
  }
}

TrackUID.COMPACT_NAME = 'TrackUID';

TrackUID.ELEMENT_ID = [0x73, 0xc5];

TrackUID.propTypes = {
  value: PropTypes.number.isRequired
};

TrackUID.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
