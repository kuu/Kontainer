import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class ChapterTimeEnd extends TypeUInt {
  constructor(props) {
    super(ChapterTimeEnd.ELEMENT_ID, ChapterTimeEnd.COMPACT_NAME, props);
  }
}

ChapterTimeEnd.COMPACT_NAME = 'ChapterTimeEnd';

ChapterTimeEnd.ELEMENT_ID = [0x92];

ChapterTimeEnd.propTypes = {
  value: PropTypes.number.isRequired
};

ChapterTimeEnd.spec = {
  container: 'ChapterAtom',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
