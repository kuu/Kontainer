import Element from './Element';

export default class File extends Element {
  constructor(props) {
    super(File.ELEMENT_ID, File.COMPACT_NAME, props);
  }

  serialize() {
    return 0;
  }

  setSize(size) {
    this.size = size;
  }

  toString() {
    return null;
  }

  static parse() {
    return [0, null];
  }
}

File.COMPACT_NAME = 'File';

File.spec = {
  mandatoryList: []
};
