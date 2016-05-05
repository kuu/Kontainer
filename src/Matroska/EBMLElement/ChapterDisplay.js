import Element from './Element';

export default class ChapterDisplay extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(ChapterDisplay.ELEMENT_ID, ChapterDisplay.COMPACT_NAME, props);
  }
}

ChapterDisplay.COMPACT_NAME = 'ChapterDisplay';

ChapterDisplay.ELEMENT_ID = [0x80];

ChapterDisplay.spec = {
  container: 'ChapterAtom',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['ChapString', 'ChapLanguage']
};
