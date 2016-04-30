import Component from '../../core/Component';
import TypeDate from './TypeDate';
import PropTypes from '../../core/PropTypes';

export default class DateUTC extends TypeDate {
  constructor(props) {
    super(DateUTC.ELEMENT_ID, DateUTC.COMPACT_NAME, props);
  }
}

DateUTC.COMPACT_NAME = 'DateUTC';

DateUTC.ELEMENT_ID = [0x44, 0x61];

DateUTC.propTypes = {
  value: PropTypes.instanceOf(Date).isRequired
};

DateUTC.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_ZERO_OR_ONE,
  mandatoryList: []
};
