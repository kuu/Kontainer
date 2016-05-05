import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CueRelativePosition extends TypeUInt {
  constructor(props) {
    super(CueRelativePosition.ELEMENT_ID, CueRelativePosition.COMPACT_NAME, props);
  }
}

CueRelativePosition.COMPACT_NAME = 'CueRelativePosition';

CueRelativePosition.ELEMENT_ID = [0xF0];

CueRelativePosition.propTypes = {
  value: PropTypes.number.isRequired
};

CueRelativePosition.spec = {
  container: 'CueTrackPositions',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
