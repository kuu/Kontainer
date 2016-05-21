export default class Component {
  constructor(type, props) {
    this.type = type;
    this.props = props;
  }

  // To be overridden
  static validate(context, props) {
    void props;
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

  // To be overridden
  static getMimeType(element) {
    return '';
  }
}

Component.QUANTITY_ANY_NUMBER = 0;
Component.QUANTITY_EXACTLY_ONE = 1;
Component.QUANTITY_ZERO_OR_ONE = 2;
