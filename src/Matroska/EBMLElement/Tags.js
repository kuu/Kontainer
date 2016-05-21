import Element from './Element';

export default class Tags extends Element {
  constructor(props) {
    props.initialSizeLen = 4;
    super(Tags.ELEMENT_ID, Tags.COMPACT_NAME, props);
  }
}

Tags.COMPACT_NAME = 'Tags';

Tags.ELEMENT_ID = [0x12, 0x54, 0xC3, 0x67];

Tags.spec = {
  container: '*',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['Tag']
};
