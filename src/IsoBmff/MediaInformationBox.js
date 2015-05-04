var Box = require('./Box');

class MediaInformationBox extends Box {
  constructor(props) {
    super(MediaInformationBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    this.size = Box.HEADER_LENGTH;
    return super.serialize(buffer, offset);
  }
}

MediaInformationBox.COMPACT_NAME = 'minf';

MediaInformationBox.spec = {
  container: 'mdia',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['dinf', 'stbl']
};

module.exports = MediaInformationBox;
