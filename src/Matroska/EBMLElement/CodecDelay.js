import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class CodecDelay extends TypeUInt {
  constructor(props) {
    super(CodecDelay.ELEMENT_ID, CodecDelay.COMPACT_NAME, props);
  }
}

CodecDelay.COMPACT_NAME = 'CodecDelay';

CodecDelay.ELEMENT_ID = [0x56, 0xAA];

CodecDelay.propTypes = {
  value: PropTypes.number
};

CodecDelay.defaultProps = {
  value: 0
};

CodecDelay.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
