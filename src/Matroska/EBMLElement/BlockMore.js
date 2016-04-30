import Element from './Element';

export default class BlockMore extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(BlockMore.ELEMENT_ID, BlockMore.COMPACT_NAME, props);
  }
}

BlockMore.COMPACT_NAME = 'BlockMore';

BlockMore.ELEMENT_ID = [0xa6];

BlockMore.spec = {
  container: 'BlockAdditions',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['BlockAddID', 'BlockAdditional']
};
