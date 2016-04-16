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

export function createElement(type, props, ...children) {
  props = props || {};
  children = children.filter(child => child instanceof Element);

  // Validate type
  if (!isValidComponentClass(type)) {
    console.error(`MediaFormat.createElement: the class (${type.name}) does not implement necessary methods.`);
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
