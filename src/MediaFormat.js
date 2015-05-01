function Element(type, props) {
  this.instance = new type(props);
}

function extractChild(child, children) {
  if (child instanceof Element) {
    children.push(child);
  } else if (child instanceof Array) {
    child.forEach(item => {
      extractChild(item, children);
    });
  }
}

function createElement(type, props={}, children) {
  var childrenArgsLen = arguments.length - 2,
      childArray = [], defaultProps;

  // Resolve children
  if (childrenArgsLen === 1) {
    extractChild(children, childArray);
  } else if (childrenArgsLen > 1) {
    for (var i = 0; i < childrenArgsLen; i++) {
      extractChild(arguments[i + 2], childArray);
    }
  }
  props.children = childArray;

  // Resolve default props
  defaultProps = type.defaultProps;
  if (defaultProps) {
    Object.keys(defaultProps).forEach(key => {
      if (props[key] === void 0) {
        props[key] = defaultProps[key];
      }
    });
  }

  return new Element(type, props);
}

module.exports = {
  createElement: createElement
};
