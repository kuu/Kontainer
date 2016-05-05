import Component from '../../core/Component';
import TypeString from './TypeString';
import PropTypes from '../../core/PropTypes';

export default class DocType extends TypeString {
  constructor(props) {
    super(DocType.ELEMENT_ID, DocType.COMPACT_NAME, props);
  }
}

DocType.COMPACT_NAME = 'DocType';

DocType.ELEMENT_ID = [0x42, 0x82];

DocType.propTypes = {
  value: PropTypes.string.isRequired
};

DocType.propTypes = {
  value: PropTypes.string
};

DocType.defaultProps = {
  value: 'webm'
};

DocType.spec = {
  container: 'EBML',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
