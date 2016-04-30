import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class DefaultDuration extends TypeUInt {
  constructor(props) {
    super(DefaultDuration.ELEMENT_ID, DefaultDuration.COMPACT_NAME, props);
  }
}

DefaultDuration.COMPACT_NAME = 'DefaultDuration';

DefaultDuration.ELEMENT_ID = [0x23, 0xe3, 0x83];

DefaultDuration.propTypes = {
  value: PropTypes.number.isRequired
};

DefaultDuration.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
