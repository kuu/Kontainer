import Element from './Element';

export default class SeekHead extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(SeekHead.ELEMENT_ID, SeekHead.COMPACT_NAME, props);
  }
}

SeekHead.COMPACT_NAME = 'SeekHead';

SeekHead.ELEMENT_ID = [0x11, 0x4d, 0x9b, 0x74];

SeekHead.spec = {
  container: 'Segment',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: []
};
