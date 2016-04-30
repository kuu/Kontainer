import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class TrackNumber extends TypeUInt {
  constructor(props) {
    super(TrackNumber.ELEMENT_ID, TrackNumber.COMPACT_NAME, props);
  }
}

TrackNumber.COMPACT_NAME = 'TrackNumber';

TrackNumber.ELEMENT_ID = [0xd7];

TrackNumber.propTypes = {
  value: PropTypes.number.isRequired
};

TrackNumber.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
