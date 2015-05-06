class Component {
  constructor(type, props) {
    this.type = type;
    this.props = props;
  }

  // virtual
  serialize(buffer, offset) {
    void offset;
  }

  // virtual
  getSize() {
  }

  // virtual
  setSize(size, buffer, offset) {
    void offset;
  }

  // virtual
  toString(context) {
    void context;
  }

  // virtual
  static parse(buffer, offset) {
    void offset;
  }
}

module.exports = Component;
