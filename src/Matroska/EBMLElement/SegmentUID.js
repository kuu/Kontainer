import Component from '../../core/Component';
import TypeBytes from './TypeBytes';
import PropTypes from '../../core/PropTypes';

export default class SegmentUID extends TypeBytes {
  constructor(props) {
    super(SegmentUID.ELEMENT_ID, SegmentUID.COMPACT_NAME, props);
  }
}

SegmentUID.COMPACT_NAME = 'SegmentUID';

SegmentUID.ELEMENT_ID = [0x73, 0xA4];

SegmentUID.propTypes = {
  value: PropTypes.any.isRequired
};

SegmentUID.spec = {
  container: 'Info',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
