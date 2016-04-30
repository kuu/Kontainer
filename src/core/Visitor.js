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
    return createElement(type, props, ...children);
  }
}

function formatBuffer(v) {
  if (global && global.Buffer) {
    return `[Buffer length=${v.length}]`;
  }
  return v + '';
}

function isBuffer(v) {
  if (global && global.Buffer) {
    return (v instanceof global.Buffer);
  }
  return (v instanceof ArrayBuffer);
}

function padding(num) {
  let str = '';
  for (let i = 0; i < num; i++) {
    str += '\t';
  }
  return str;
}

function formatValue(v) {
  if (v instanceof Date) {
    return v + '';
  } else if (isBuffer(v)) {
    return formatBuffer(v);
  } else if (typeof v === 'object') {
    const arr = [];
    Object.keys(v).forEach(key => {
      arr.push(key + ': ' + formatValue(v[key]));
    });
    return `{${arr.join(', ')}}`;
  } else if (typeof v === 'string') {
    return '"' + v + '"';
  }
  return v;
}

function formatArray(a) {
  if (a.length > 100) {
    return `[array of length=${a.length}]`;
  }
  const arr = [];
  a.forEach(v => {
    if (v instanceof Array) {
      arr.push(formatArray(v));
    } else {
      arr.push(formatValue(v));
    }
  });
  return `[${arr.join(', ')}]`;
}

export class DumpVisitor extends Visitor {
  constructor() {
    super();
  }

  enter(type, props) {
    super.enter(type, props);
    const depth = this.depth();
    console.log(`${padding(depth)}[${type.COMPACT_NAME}] >>>> start`);
    Object.keys(props).forEach(key => {
      let value = props[key];
      if (value instanceof Array) {
        value = formatArray(value);
      } else {
        value = formatValue(value);
      }
      console.log(`${padding(depth)}\t${key}: ${value}`);
    });
  }

  visit(type) {
    const depth = this.depth();
    console.log(`${padding(depth)}[${type.COMPACT_NAME}] <<<< end`);
  }
}
