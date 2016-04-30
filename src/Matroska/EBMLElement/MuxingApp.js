import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class MuxingApp extends TypeString {
  constructor(props) {
    super(MuxingApp.ELEMENT_ID, MuxingApp.COMPACT_NAME, props);
  }
}

MuxingApp.COMPACT_NAME = 'MuxingApp';

MuxingApp.ELEMENT_ID = [0x4d, 0x80];

MuxingApp.propTypes = {
  value: PropTypes.string
};

MuxingApp.defaultProps = {
  value: 'kontainer-js'
};

MuxingApp.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
