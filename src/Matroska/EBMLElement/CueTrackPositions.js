import Element from './Element';
import {throwException} from '../../core/Util';

export default class CueTrackPositions extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(CueTrackPositions.ELEMENT_ID, CueTrackPositions.COMPACT_NAME, props);
  }
}

CueTrackPositions.COMPACT_NAME = 'CueTrackPositions';

CueTrackPositions.ELEMENT_ID = [0xB7];

CueTrackPositions.spec = {
  container: 'CuePoint',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['CueTrack', 'CueClusterPosition']
};
