import Element from './Element';

export default class Cues extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(Cues.ELEMENT_ID, Cues.COMPACT_NAME, props);
  }
}

Cues.COMPACT_NAME = 'Cues';

Cues.ELEMENT_ID = [0x1c, 0x53, 0xbb, 0x6b];

Cues.spec = {
  container: '*',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['CuePoint']
};
