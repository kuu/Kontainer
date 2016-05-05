import Element from './Element';

export default class BlockGroup extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(BlockGroup.ELEMENT_ID, BlockGroup.COMPACT_NAME, props);
  }
}

BlockGroup.COMPACT_NAME = 'BlockGroup';

BlockGroup.ELEMENT_ID = [0xa0];

BlockGroup.spec = {
  container: 'Cluster',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['Block']
};
