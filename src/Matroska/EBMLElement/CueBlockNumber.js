import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CueBlockNumber extends TypeUInt {
  constructor(props) {
    super(CueBlockNumber.ELEMENT_ID, CueBlockNumber.COMPACT_NAME, props);
  }
}

CueBlockNumber.COMPACT_NAME = 'CueBlockNumber';

CueBlockNumber.ELEMENT_ID = [0x53, 0x78];

CueBlockNumber.propTypes = {
  value: PropTypes.number
};

CueBlockNumber.defaultProps = {
  value: 1
};

CueBlockNumber.spec = {
  container: 'CueTrackPositions',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
