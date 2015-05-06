var Box = require('./Box');

class MovieBox extends Box {
  constructor(props) {
    super(MovieBox.COMPACT_NAME, props);
  }
}

MovieBox.COMPACT_NAME = 'moov';

MovieBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['mvhd', 'trak']
};

module.exports = MovieBox;
