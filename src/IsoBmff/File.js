var Box = require('./Box');

class File extends Box {
  constructor(props) {
    super(File.COMPACT_NAME, props);
  }

  serialize(buffer, offset) {
    void offset;
    return 0;
  }

  setSize(size, buffer, offset) {
    void offset;
    // Nop
  }
}

File.COMPACT_NAME = 'file';

File.spec = {
  mandatoryBoxList: ['ftyp', 'moov']
};

module.exports = File;
