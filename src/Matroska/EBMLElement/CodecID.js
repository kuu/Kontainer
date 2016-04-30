import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class CodecID extends TypeString {
  constructor(props) {
    super(CodecID.ELEMENT_ID, CodecID.COMPACT_NAME, props);
  }
}

CodecID.COMPACT_NAME = 'CodecID';

CodecID.ELEMENT_ID = [0x86];

CodecID.propTypes = {
  value: PropTypes.string.isRequired
};

CodecID.spec = {
  container: 'TrackEntry',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
