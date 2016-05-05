import Component from '../../core/Component';
import TypeBool from './TypeBool';
import PropTypes from '../../core/PropTypes';

export default class FlagEnabled extends TypeBool {
  constructor(props) {
    super(FlagEnabled.ELEMENT_ID, FlagEnabled.COMPACT_NAME, props);
  }
}

FlagEnabled.COMPACT_NAME = 'FlagEnabled';

FlagEnabled.ELEMENT_ID = [0xb9];

FlagEnabled.propTypes = {
  value: PropTypes.bool
};

FlagEnabled.defaultProps = {
  value: true
};

FlagEnabled.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
