import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class Language extends TypeString {
  constructor(props) {
    super(Language.ELEMENT_ID, Language.COMPACT_NAME, props);
  }
}

Language.COMPACT_NAME = 'Language';

Language.ELEMENT_ID = [0x22, 0xB5, 0x9C];

Language.propTypes = {
  value: PropTypes.string
};

Language.defaultProps = {
  value: 'eng'
};

Language.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
