var Box = require('./Box');

class DataInformationBox extends Box {
  constructor(props) {
    super(DataInformationBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    this.size = Box.HEADER_LENGTH;
    return super.serialize(buffer, offset);
  }
}

DataInformationBox.COMPACT_NAME = 'dinf';

DataInformationBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['dref']
};

module.exports = DataInformationBox;
