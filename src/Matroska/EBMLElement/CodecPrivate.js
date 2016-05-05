import Component from '../../core/Component';
import TypeBytes from './TypeBytes';
import PropTypes from '../../core/PropTypes';

export default class CodecPrivate extends TypeBytes {
  constructor(props) {
    super(CodecPrivate.ELEMENT_ID, CodecPrivate.COMPACT_NAME, props);
  }
}

CodecPrivate.COMPACT_NAME = 'CodecPrivate';

CodecPrivate.ELEMENT_ID = [0x63, 0xA2];

CodecPrivate.propTypes = {
  value: PropTypes.any.isRequired
};

CodecPrivate.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
