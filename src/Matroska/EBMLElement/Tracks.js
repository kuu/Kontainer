import Element from './Element';
import {throwException} from '../../core/Util';

export default class Tracks extends Element {
  constructor(props) {
    props.initialSizeLen = 4;
    super(Tracks.ELEMENT_ID, Tracks.COMPACT_NAME, props);
  }
}

Tracks.COMPACT_NAME = 'Tracks';

Tracks.ELEMENT_ID = [0x16, 0x54, 0xae, 0x6b];

Tracks.spec = {
  container: 'Segment',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['TrackEntry']
};
