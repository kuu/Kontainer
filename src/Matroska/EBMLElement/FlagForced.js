import Component from '../../core/Component';
import TypeBool from './TypeBool';
import PropTypes from '../../core/PropTypes';

export default class FlagForced extends TypeBool {
  constructor(props) {
    super(FlagForced.ELEMENT_ID, FlagForced.COMPACT_NAME, props);
  }
}

FlagForced.COMPACT_NAME = 'FlagForced';

FlagForced.ELEMENT_ID = [0x55, 0xaa];

FlagForced.propTypes = {
  value: PropTypes.bool
};

FlagForced.defaultProps = {
  value: false
};

FlagForced.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
