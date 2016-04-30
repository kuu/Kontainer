import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class ChapString extends TypeString {
  constructor(props) {
    super(ChapString.ELEMENT_ID, ChapString.COMPACT_NAME, props);
  }
}

ChapString.COMPACT_NAME = 'ChapString';

ChapString.ELEMENT_ID = [0x85];

ChapString.propTypes = {
  value: PropTypes.string.isRequired
};

ChapString.spec = {
  container: 'ChapterDisplay',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
