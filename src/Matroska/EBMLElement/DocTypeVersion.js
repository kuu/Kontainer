import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class DocTypeVersion extends TypeUInt {
  constructor(props) {
    super(DocTypeVersion.ELEMENT_ID, DocTypeVersion.COMPACT_NAME, props);
  }
}

DocTypeVersion.COMPACT_NAME = 'DocTypeVersion';

DocTypeVersion.ELEMENT_ID = [0x42, 0x87];

DocTypeVersion.propTypes = {
  value: PropTypes.number
};

DocTypeVersion.defaultProps = {
  value: 1
};

DocTypeVersion.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
