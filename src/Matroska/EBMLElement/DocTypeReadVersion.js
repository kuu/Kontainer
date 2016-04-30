import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

export default class DocTypeReadVersion extends TypeUInt {
  constructor(props) {
    super(DocTypeReadVersion.ELEMENT_ID, DocTypeReadVersion.COMPACT_NAME, props);
  }
}

DocTypeReadVersion.COMPACT_NAME = 'DocTypeReadVersion';

DocTypeReadVersion.ELEMENT_ID = [0x42, 0x85];

DocTypeReadVersion.propTypes = {
  value: PropTypes.number
};

DocTypeReadVersion.defaultProps = {
  value: 1
};

DocTypeReadVersion.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
