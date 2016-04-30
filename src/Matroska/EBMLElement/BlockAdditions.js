import Element from './Element';

export default class BlockAdditions extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(BlockAdditions.ELEMENT_ID, BlockAdditions.COMPACT_NAME, props);
  }
}

BlockAdditions.COMPACT_NAME = 'BlockAdditions';

BlockAdditions.ELEMENT_ID = [0x75, 0xa1];

BlockAdditions.spec = {
  container: 'BlockGroup',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['BlockMore']
};
