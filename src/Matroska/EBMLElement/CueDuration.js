import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CueDuration extends TypeUInt {
  constructor(props) {
    super(CueDuration.ELEMENT_ID, CueDuration.COMPACT_NAME, props);
  }
}

CueDuration.COMPACT_NAME = 'CueDuration';

CueDuration.ELEMENT_ID = [0xB2];

CueDuration.propTypes = {
  value: PropTypes.number.isRequired
};

CueDuration.spec = {
  container: 'CueTrackPositions',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
