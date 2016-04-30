import Element from './Element';

export default class Audio extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(Audio.ELEMENT_ID, Audio.COMPACT_NAME, props);
  }
}

Audio.COMPACT_NAME = 'Audio';

Audio.ELEMENT_ID = [0xe1];

Audio.spec = {
  container: 'TrackEntry',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['SamplingFrequency', 'Channels']
};
