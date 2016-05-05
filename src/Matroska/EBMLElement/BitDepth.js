import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class BitDepth extends TypeUInt {
  constructor(props) {
    super(BitDepth.ELEMENT_ID, BitDepth.COMPACT_NAME, props);
  }
}

BitDepth.COMPACT_NAME = 'BitDepth';

BitDepth.ELEMENT_ID = [0x62, 0x64];

BitDepth.propTypes = {
  value: PropTypes.number.isRequired
};

BitDepth.spec = {
  container: 'Audio',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
