import Box from './Box';

export default class MediaBox extends Box {
  constructor(props) {
    super(MediaBox.COMPACT_NAME, props);
  }
}

MediaBox.COMPACT_NAME = 'mdia';

MediaBox.spec = {
  container: 'trak',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['mdhd', 'hdlr', 'minf']
};
