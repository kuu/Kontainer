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
  mandatoryBoxList: ['stsd', 'stts', 'stsc', ['stsz', 'stz2'], ['stco', 'co64']]
};

module.exports = SampleTableBox;
