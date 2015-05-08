var Box = require('./Box');

class SampleTableBox extends Box {
  constructor(props) {
    super(SampleTableBox.COMPACT_NAME, props);
  }
}

SampleTableBox.COMPACT_NAME = 'stbl';

SampleTableBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  //mandatoryBoxList: ['stsd', 'stts', ['stsz', 'stz2'], 'stsc', ['stco', 'co64']]
  mandatoryBoxList: ['stsd']
};

module.exports = SampleTableBox;
