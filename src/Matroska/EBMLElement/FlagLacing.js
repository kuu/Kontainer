import Component from '../../core/Component';
import TypeBool from './TypeBool';
import PropTypes from '../../core/PropTypes';

export default class FlagLacing extends TypeBool {
  constructor(props) {
    super(FlagLacing.ELEMENT_ID, FlagLacing.COMPACT_NAME, props);
  }
}

FlagLacing.COMPACT_NAME = 'FlagLacing';

FlagLacing.ELEMENT_ID = [0x9c];

FlagLacing.propTypes = {
  value: PropTypes.bool
};

FlagLacing.defaultProps = {
  value: true
};

FlagLacing.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
