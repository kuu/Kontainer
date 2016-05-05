import Box from './Box';

export default class MovieBox extends Box {
  constructor(props) {
    super(MovieBox.COMPACT_NAME, props);
  }
}

MovieBox.COMPACT_NAME = 'moov';

MovieBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['mvhd', 'trak']
};
