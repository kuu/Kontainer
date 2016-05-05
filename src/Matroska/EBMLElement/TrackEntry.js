import Element from './Element';
import {throwException} from '../../core/Util';

export default class TrackEntry extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(TrackEntry.ELEMENT_ID, TrackEntry.COMPACT_NAME, props);
  }
}

TrackEntry.COMPACT_NAME = 'TrackEntry';

TrackEntry.ELEMENT_ID = [0xAE];

TrackEntry.spec = {
  container: 'Tracks',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['TrackNumber', 'TrackUID', 'TrackType', 'FlagEnabled', 'FlagDefault', 'FlagForced', 'FlagLacing', 'CodecID', 'SeekPreRoll']
};
