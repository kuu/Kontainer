import Element from './Element';

export default class Seek extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(Seek.ELEMENT_ID, Seek.COMPACT_NAME, props);
  }
}

Seek.COMPACT_NAME = 'Seek';

Seek.ELEMENT_ID = [0x4d, 0xbb];

Seek.spec = {
  container: 'SeekHead',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['SeekID', 'SeekPosition']
};
