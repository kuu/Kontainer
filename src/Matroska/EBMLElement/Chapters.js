import Element from './Element';

export default class Chapters extends Element {
  constructor(props) {
    props.initialSizeLen = 4;
    super(Chapters.ELEMENT_ID, Chapters.COMPACT_NAME, props);
  }
}

Chapters.COMPACT_NAME = 'Chapters';

Chapters.ELEMENT_ID = [0x10, 0x43, 0xa7, 0x70];

Chapters.spec = {
  container: '*',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['EditionEntry']
};
