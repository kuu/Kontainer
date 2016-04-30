import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CueTrack extends TypeUInt {
  constructor(props) {
    super(CueTrack.ELEMENT_ID, CueTrack.COMPACT_NAME, props);
  }
}

CueTrack.COMPACT_NAME = 'CueTrack';

CueTrack.ELEMENT_ID = [0xF7];

CueTrack.propTypes = {
  value: PropTypes.number.isRequired
};

CueTrack.spec = {
  container: 'CueTrackPositions',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
