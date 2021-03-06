import Box from './Box';

export default class TrackBox extends Box {
  constructor(props) {
    super(TrackBox.COMPACT_NAME, props);
  }
}

TrackBox.COMPACT_NAME = 'trak';

TrackBox.spec = {
  container: 'moov',
  quantity: Box.QUANTITY_ANY_NUMBER, // Actually one or more.
  mandatoryList: ['tkhd', 'mdia']
};
