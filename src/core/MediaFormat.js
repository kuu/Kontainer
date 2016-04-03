import Component from './Component';

class Element {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    this.instance = null; // Instantiation is deferred until the rendering time.
  }

  querySelector(type) {
    let queue = [this];
    let element;

    while (element = queue.shift()) {
      if (type === element.type.COMPACT_NAME) {
        return element;
      }
      const children = element.props.children;
      if (children) {
        children.forEach(child => {
          queue.push(child);
        });
      }
    }
    return null;
  }
}

function extractChild(child, childArray) {
  if (child instanceof Element) {
    childArray.push(child);
  } else if (child instanceof Array) {
    child.forEach(item => {
      extractChild(item, childArray);
    });
  }
}

function isValidComponentClass(type) {
  const proto = type.prototype;

  if (proto instanceof Component &&
      typeof proto.serialize === 'function' &&
      typeof proto.getSize === 'function' &&
      typeof proto.setSize === 'function') {
    return true;
  }
  return false;
}

function createElement(type, props, children) {
  const childrenArgsLen = arguments.length - 2;
  const childArray = [];

  props = props || {};

  // Validate type
  if (!isValidComponentClass(type)) {
    console.error(`MediaFormat.createElement: the class (${type.name}) does not implement necessary methods.`);
    return null;
  }

  // Resolve children
  if (childrenArgsLen === 1) {
    extractChild(children, childArray);
  } else if (childrenArgsLen > 1) {
    for (let i = 0; i < childrenArgsLen; i++) {
      extractChild(arguments[i + 2], childArray);
    }
  }
  props.children = childArray;

  // Resolve default props
  const defaultProps = type.defaultProps;
  if (defaultProps) {
    Object.keys(defaultProps).forEach(key => {
      if (props[key] === void 0) {
        props[key] = defaultProps[key];
      }
    });
  }
  return new Element(type, props);
}

export default {
  createElement
};
