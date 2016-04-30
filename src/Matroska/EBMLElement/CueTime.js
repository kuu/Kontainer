import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CueTime extends TypeUInt {
  constructor(props) {
    super(CueTime.ELEMENT_ID, CueTime.COMPACT_NAME, props);
  }
}

CueTime.COMPACT_NAME = 'CueTime';

CueTime.ELEMENT_ID = [0xB3];

CueTime.propTypes = {
  value: PropTypes.number.isRequired
};

CueTime.spec = {
  container: 'CuePoint',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
