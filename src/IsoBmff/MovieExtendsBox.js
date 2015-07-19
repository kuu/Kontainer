var Box = require('./Box');

class MovieExtendsBox extends Box {
  constructor(props) {
    super(MovieExtendsBox.COMPACT_NAME, props);
  }
}

MovieExtendsBox.COMPACT_NAME = 'mvex';

MovieExtendsBox.spec = {
  container: 'moov',
  quantity: Box.QUANTITY_EXACTLY_ONE, // Actually zero or one.
  mandatoryBoxList: ['trex']
};

module.exports = MovieExtendsBox;