import Element from './Element';

export default class CuePoint extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(CuePoint.ELEMENT_ID, CuePoint.COMPACT_NAME, props);
  }
}

CuePoint.COMPACT_NAME = 'CuePoint';

CuePoint.ELEMENT_ID = [0xBB];

CuePoint.spec = {
  container: 'Cues',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['CueTime', 'CueTrackPositions']
};
