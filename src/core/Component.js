class Component {
  constructor(type, props) {
    this.type = type;
    this.props = props;
  }

  // To be overridden
  static validate(context) {
    void context;
    return null;
  }

  // To be overridden
  serialize(buffer, offset) {
    void offset;
  }

  // To be overridden
  getSize() {
  }

  // To be overridden
  setSize(size, buffer, offset) {
    void offset;
  }

  // To be overridden
  toString(context) {
    void context;
  }

  // To be overridden
  static parse(buffer, offset) {
    void offset;
  }
}

module.exports = Component;
