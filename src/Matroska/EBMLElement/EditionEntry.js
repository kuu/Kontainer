import Element from './Element';

export default class EditionEntry extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(EditionEntry.ELEMENT_ID, EditionEntry.COMPACT_NAME, props);
  }
}

EditionEntry.COMPACT_NAME = 'EditionEntry';

EditionEntry.ELEMENT_ID = [0x45, 0xB9];

EditionEntry.spec = {
  container: 'Chapters',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['ChapterAtom']
};
