import Element from './Element';

export default class SimpleTag extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(SimpleTag.ELEMENT_ID, SimpleTag.COMPACT_NAME, props);
  }
}

SimpleTag.COMPACT_NAME = 'SimpleTag';

SimpleTag.ELEMENT_ID = [0x67, 0xC8];

SimpleTag.spec = {
  container: 'Tag',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['TagName', 'TagLanguage', 'TagDefault']
};
