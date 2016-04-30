import Element from './Element';

export default class Video extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(Video.ELEMENT_ID, Video.COMPACT_NAME, props);
  }
}

Video.COMPACT_NAME = 'Video';

Video.ELEMENT_ID = [0xe0];

Video.spec = {
  container: 'TrackEntry',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['FlagInterlaced', 'PixelWidth', 'PixelHeight']
};
