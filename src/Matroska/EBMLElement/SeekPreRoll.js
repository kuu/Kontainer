import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class SeekPreRoll extends TypeUInt {
  constructor(props) {
    super(SeekPreRoll.ELEMENT_ID, SeekPreRoll.COMPACT_NAME, props);
  }
}

SeekPreRoll.COMPACT_NAME = 'SeekPreRoll';

SeekPreRoll.ELEMENT_ID = [0x56, 0xBB];

SeekPreRoll.propTypes = {
  value: PropTypes.number
};

SeekPreRoll.defaultProps = {
  value: 0
};

SeekPreRoll.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
