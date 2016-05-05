import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class EBMLMaxIDLength extends TypeUInt {
  constructor(props) {
    super(EBMLMaxIDLength.ELEMENT_ID, EBMLMaxIDLength.COMPACT_NAME, props);
  }

  static validate(context, props) {
    context.maxIdLength = props.value;
  }
}

EBMLMaxIDLength.COMPACT_NAME = 'EBMLMaxIDLength';

EBMLMaxIDLength.ELEMENT_ID = [0x42, 0xf2];

EBMLMaxIDLength.propTypes = {
  value: PropTypes.number
};

EBMLMaxIDLength.defaultProps = {
  value: 4
};

EBMLMaxIDLength.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
