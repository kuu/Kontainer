import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class Name extends TypeString {
  constructor(props) {
    super(Name.ELEMENT_ID, Name.COMPACT_NAME, props);
  }
}

Name.COMPACT_NAME = 'Name';

Name.ELEMENT_ID = [0x53, 0x6e];

Name.propTypes = {
  value: PropTypes.string.isRequired
};

Name.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
