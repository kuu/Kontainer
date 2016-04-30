import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class ChapLanguage extends TypeString {
  constructor(props) {
    super(ChapLanguage.ELEMENT_ID, ChapLanguage.COMPACT_NAME, props);
  }
}

ChapLanguage.COMPACT_NAME = 'ChapLanguage';

ChapLanguage.ELEMENT_ID = [0x43, 0x7C];

ChapLanguage.propTypes = {
  value: PropTypes.string
};

ChapLanguage.defaultProps = {
  value: 'eng'
};

ChapLanguage.spec = {
  container: 'ChapterDisplay',
  quantity: Component.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
