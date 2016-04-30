import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class ChapterStringUID extends TypeString {
  constructor(props) {
    super(ChapterStringUID.ELEMENT_ID, ChapterStringUID.COMPACT_NAME, props);
  }
}

ChapterStringUID.COMPACT_NAME = 'ChapterStringUID';

ChapterStringUID.ELEMENT_ID = [0x56, 0x54];

ChapterStringUID.propTypes = {
  value: PropTypes.string.isRequired
};

ChapterStringUID.spec = {
  container: 'ChapterAtom',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
