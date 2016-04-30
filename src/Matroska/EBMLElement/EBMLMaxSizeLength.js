import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class EBMLMaxSizeLength extends TypeUInt {
  constructor(props) {
    super(EBMLMaxSizeLength.ELEMENT_ID, EBMLMaxSizeLength.COMPACT_NAME, props);
  }

  static validate(context, props) {
    context.maxSizeLength = props.value;
  }
}

EBMLMaxSizeLength.COMPACT_NAME = 'EBMLMaxSizeLength';

EBMLMaxSizeLength.ELEMENT_ID = [0x42, 0xf3];

EBMLMaxSizeLength.propTypes = {
  value: PropTypes.number
};

EBMLMaxSizeLength.defaultProps = {
  value: 8
};

EBMLMaxSizeLength.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
