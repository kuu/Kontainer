import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class WritingApp extends TypeString {
  constructor(props) {
    super(WritingApp.ELEMENT_ID, WritingApp.COMPACT_NAME, props);
  }
}

WritingApp.COMPACT_NAME = 'WritingApp';

WritingApp.ELEMENT_ID = [0x57, 0x41];

WritingApp.propTypes = {
  value: PropTypes.string
};

WritingApp.defaultProps = {
  value: 'kontainer-js'
};

WritingApp.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
