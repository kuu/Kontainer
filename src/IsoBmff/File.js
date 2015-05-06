var Box = require('./Box');

class File extends Box {
  constructor(props) {
    super(File.COMPACT_NAME, props);
  }

  serialize() {
    return 0;
  }

  setSize() {
    // Nop
  }

  toString() {
    return null;
  }

  static parse() {
    return [0, null];
  }
}

File.COMPACT_NAME = 'file';

File.spec = {
  mandatoryBoxList: ['ftyp', 'moov']
};

module.exports = File;
