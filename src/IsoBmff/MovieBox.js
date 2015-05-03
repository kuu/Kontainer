var Box = require('./Box');

class MovieBox extends Box {
  constructor(props) {
    super(MovieBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    this.size = Box.HEADER_LENGTH;
    return super.serialize(buffer, offset);
  }
}

MovieBox.COMPACT_NAME = 'moov';

MovieBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['mvhd', 'trak']
};

module.exports = MovieBox;
