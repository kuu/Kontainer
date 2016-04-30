import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class ChapterUID extends TypeUInt {
  constructor(props) {
    super(ChapterUID.ELEMENT_ID, ChapterUID.COMPACT_NAME, props);
  }
}

ChapterUID.COMPACT_NAME = 'ChapterUID';

ChapterUID.ELEMENT_ID = [0x73, 0xC4];

ChapterUID.propTypes = {
  value: PropTypes.number.isRequired
};

ChapterUID.spec = {
  container: 'ChapterAtom',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
