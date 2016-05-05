import Component from '../../core/Component';
import TypeBool from './TypeBool';
import PropTypes from '../../core/PropTypes';

export default class FlagDefault extends TypeBool {
  constructor(props) {
    super(FlagDefault.ELEMENT_ID, FlagDefault.COMPACT_NAME, props);
  }
}

FlagDefault.COMPACT_NAME = 'FlagDefault';

FlagDefault.ELEMENT_ID = [0x88];

FlagDefault.propTypes = {
  value: PropTypes.bool
};

FlagDefault.defaultProps = {
  value: true
};

FlagDefault.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
