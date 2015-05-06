var Box = require('./Box');

class DataInformationBox extends Box {
  constructor(props) {
    super(DataInformationBox.COMPACT_NAME, props);
  }
}

DataInformationBox.COMPACT_NAME = 'dinf';

DataInformationBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['dref']
};

module.exports = DataInformationBox;
