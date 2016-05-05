import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class ChapterTimeStart extends TypeUInt {
  constructor(props) {
    super(ChapterTimeStart.ELEMENT_ID, ChapterTimeStart.COMPACT_NAME, props);
  }
}

ChapterTimeStart.COMPACT_NAME = 'ChapterTimeStart';

ChapterTimeStart.ELEMENT_ID = [0x91];

ChapterTimeStart.propTypes = {
  value: PropTypes.number.isRequired
};

ChapterTimeStart.spec = {
  container: 'ChapterAtom',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
