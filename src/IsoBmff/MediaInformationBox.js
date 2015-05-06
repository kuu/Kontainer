var Box = require('./Box');

class MediaInformationBox extends Box {
  constructor(props) {
    super(MediaInformationBox.COMPACT_NAME, props);
  }
}

MediaInformationBox.COMPACT_NAME = 'minf';

MediaInformationBox.spec = {
  container: 'mdia',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: [['vmhd', 'smhd', 'hmhd', 'nmhd'], 'dinf', 'stbl']
};

module.exports = MediaInformationBox;
