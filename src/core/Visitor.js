// Base class for the Visitor pattern.
export default class Visitor {
  constructor() {
    this.stack = [];
    this.offset = 0;
  }

  // This method will be called when entering a node.
  enter(type, props) {
    // To be overridden
  }

  // This method will be called when exiting a node.
  // The return value will be stored in the children property of the parent node.
  exit(type, props, children) {
    // To be overridden
  }

  // You can attach any data to the current stack.
  // Usually, this is called within enter() method.
  setData(data) {
    const len = this.stack.length;
    if (len > 0) {
      this.stack[len - 1].userData = data;
    }
  }

  // Usually, this is called within exit() method.
  getData() {
    const len = this.stack.length;
    if (len === 0) {
      return null;
    }
    return this.stack[len - 1].userData;
  }

  depth() {
    return this.stack.length - 1;
  }
}
