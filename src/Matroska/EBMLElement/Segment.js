import Element from './Element';

export default class Segment extends Element {
  constructor(props) {
    props.initialSizeLen = 8;
    super(Segment.ELEMENT_ID, Segment.COMPACT_NAME, props);
  }
}

Segment.COMPACT_NAME = 'Segment';

Segment.ELEMENT_ID = [0x18, 0x53, 0x80, 0x67];

Segment.spec = {
  container: 'File',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['Info']
};
