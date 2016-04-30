import Element from './Element';

export default class Tag extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(Tag.ELEMENT_ID, Tag.COMPACT_NAME, props);
  }
}

Tag.COMPACT_NAME = 'Tag';

Tag.ELEMENT_ID = [0x73, 0x73];

Tag.spec = {
  container: 'Tags',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['Targets', 'SimpleTag']
};
