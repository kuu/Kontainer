var Box = require('./Box');

class MediaBox extends Box {
  constructor(props) {
    super(MediaBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    this.size = Box.HEADER_LENGTH;
    return super.serialize(buffer, offset);
  }
}

MediaBox.COMPACT_NAME = 'mdia';

MediaBox.spec = {
  container: 'trak',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['mdhd', 'hdlr', 'minf']
};

module.exports = MediaBox;
