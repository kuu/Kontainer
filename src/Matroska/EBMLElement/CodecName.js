import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class CodecName extends TypeString {
  constructor(props) {
    super(CodecName.ELEMENT_ID, CodecName.COMPACT_NAME, props);
  }
}

CodecName.COMPACT_NAME = 'CodecName';

CodecName.ELEMENT_ID = [0x25, 0x86, 0x88];

CodecName.propTypes = {
  value: PropTypes.string.isRequired
};

CodecName.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
