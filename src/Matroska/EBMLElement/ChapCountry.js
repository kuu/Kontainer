import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class ChapCountry extends TypeString {
  constructor(props) {
    super(ChapCountry.ELEMENT_ID, ChapCountry.COMPACT_NAME, props);
  }
}

ChapCountry.COMPACT_NAME = 'ChapCountry';

ChapCountry.ELEMENT_ID = [0x43, 0x7E];

ChapCountry.propTypes = {
  value: PropTypes.string.isRequired
};

ChapCountry.spec = {
  container: 'ChapterDisplay',
  quantity: Component.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
