import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class Timecode extends TypeUInt {
  constructor(props) {
    super(Timecode.ELEMENT_ID, Timecode.COMPACT_NAME, props);
  }
}

Timecode.COMPACT_NAME = 'Timecode';

Timecode.ELEMENT_ID = [0xe7];

Timecode.propTypes = {
  value: PropTypes.number.isRequired
};

Timecode.spec = {
  container: 'Cluster',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
