import Element from './Element';

export default class ChapterAtom extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(ChapterAtom.ELEMENT_ID, ChapterAtom.COMPACT_NAME, props);
  }
}

ChapterAtom.COMPACT_NAME = 'ChapterAtom';

ChapterAtom.ELEMENT_ID = [0xB6];

ChapterAtom.spec = {
  container: 'EditionEntry',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['ChapterUID', 'ChapterTimeStart']
};
