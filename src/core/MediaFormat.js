import Component from './Component';

class Element {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    this.instance = null; // Instantiation is deferred until the rendering time.
    this.rootClass = null;
  }

  querySelector(type) {
    const queue = [this];
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

  querySelectorAll(type) {
    const queue = [this];
    const elems = [];
    let element;

    while (element = queue.shift()) {
      if (type === element.type.COMPACT_NAME) {
        elems.push(element);
      }
      const children = element.props.children;
      if (children) {
        children.forEach(child => {
          queue.push(child);
        });
      }
    }
    return elems;
  }

  getMimeType() {
    return this.type.getMimeType(this);
  }

  setRootClass(rootClass) {
    this.rootClass = rootClass;
  }

  wrap(elements) {
    if (this.rootClass) {
      return createElement(this.rootClass, null, elements);
    }
    return null;
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

function unfold(list) {
  const plain = [];
  list.forEach(function f(item) {
    if (Array.isArray(item)) {
      item.forEach(f);
    } else {
      plain.push(item);
    }
  });
  return plain;
}

export function createElement(type, props, ...children) {
  props = props || {};

  children = unfold(children);
  children = children.filter(child => child instanceof Element);

  // Validate type
  if (!isValidComponentClass(type)) {
    console.error(`MediaFormat.createElement: the class (${type}) does not implement necessary methods.`);
    return null;
  }
  props.children = children;

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
