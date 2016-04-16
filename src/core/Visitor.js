import {createElement} from './MediaFormat';

// Base class for the Visitor pattern.
export class Visitor {
  constructor() {
    this.stack = [];
    this.offset = 0;
    this.results = [];
  }

  // This method will be called when entering a node.
  enter(type, props) {
    this.stack.push({type, props, children: []});
  }

  // This method will be called when exiting a node.
  // The return value will be stored in the children property of the parent node.
  exit() {
    const stack = this.stack;
    const {type, props, children} = stack[stack.length - 1];
    const result = this.visit(type, props, children);
    stack.pop();
    if (result) {
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(result);
      } else {
        this.results.push(result);
      }
    }
  }

  visit(type, props, children) {
    // Implement this in a subclass
    return null;
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

export class ElementVisitor extends Visitor {
  constructor() {
    super();
  }

  visit (type, props, children) {
    return createElement(type, props, children);
  }
}
