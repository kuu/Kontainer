import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class EBMLVersion extends TypeUInt {
  constructor(props) {
    super(EBMLVersion.ELEMENT_ID, EBMLVersion.COMPACT_NAME, props);
  }
}

EBMLVersion.COMPACT_NAME = 'EBMLVersion';

EBMLVersion.ELEMENT_ID = [0x42, 0x86];

EBMLVersion.propTypes = {
  value: PropTypes.number
};

EBMLVersion.defaultProps = {
  value: 1
};

EBMLVersion.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
