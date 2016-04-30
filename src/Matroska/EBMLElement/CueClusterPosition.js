import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CueClusterPosition extends TypeUInt {
  constructor(props) {
    super(CueClusterPosition.ELEMENT_ID, CueClusterPosition.COMPACT_NAME, props);
  }
}

CueClusterPosition.COMPACT_NAME = 'CueClusterPosition';

CueClusterPosition.ELEMENT_ID = [0xF1];

CueClusterPosition.propTypes = {
  value: PropTypes.number.isRequired
};

CueClusterPosition.spec = {
  container: 'CueTrackPositions',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
