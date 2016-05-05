import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class EBMLReadVersion extends TypeUInt {
  constructor(props) {
    super(EBMLReadVersion.ELEMENT_ID, EBMLReadVersion.COMPACT_NAME, props);
  }
}

EBMLReadVersion.COMPACT_NAME = 'EBMLReadVersion';

EBMLReadVersion.ELEMENT_ID = [0x42, 0xf7];

EBMLReadVersion.propTypes = {
  value: PropTypes.number
};

EBMLReadVersion.defaultProps = {
  value: 1
};

EBMLReadVersion.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
