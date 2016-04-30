import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class TimecodeScale extends TypeUInt {
  constructor(props) {
    super(TimecodeScale.ELEMENT_ID, TimecodeScale.COMPACT_NAME, props);
  }
}

TimecodeScale.COMPACT_NAME = 'TimecodeScale';

TimecodeScale.ELEMENT_ID = [0x2a, 0xd7, 0xb1];

TimecodeScale.propTypes = {
  value: PropTypes.number
};

TimecodeScale.defaultProps = {
  value: 1000000
};

TimecodeScale.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
