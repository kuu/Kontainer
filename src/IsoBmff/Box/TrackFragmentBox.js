import Box from './Box';

export default class TrackFragmentBox extends Box {
  constructor(props) {
    super(TrackFragmentBox.COMPACT_NAME, props);
  }
}

TrackFragmentBox.COMPACT_NAME = 'traf';

TrackFragmentBox.spec = {
  container: 'moof',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryList: ['tfhd']
};
