var IsoBmff = require('./IsoBmff/'),
    WebM = require('./WebM/'),
    PropTypes = require('./util/PropTypes'),
    Writer = require('./util/Writer'),
    Logger = require('./util/Logger');

var clazz = {};

function Element(clazz, props) {
  this.clazz = clazz;
  this.props = props;
}

function createElement(type, props, children) {
  var childrenArgsLen = arguments.length - 2,
      childArray, elementClass, defaultProps;

  props = props || {};

  if (typeof type === 'string') {
    elementClass = clazz[type];
    if (!elementClass) {
      console.error('Kontainer.createElement: invalid type.');
      return;
    }
  } else if (type && typeof type.render === 'function') {
    elementClass = type;
  } else {
    console.error('Kontainer.createElement: type should be a string or a class object.');
    return;
  }

  if (childrenArgsLen === 1) {
    if (children instanceof Element) {
      props.children = [children];
    } else if (children instanceof Array) {
      props.children = children;
    } else if (children !== null) {
      console.error('Kontainer.createElement: children should be an Element or an array.');
      return;
    }
  } else if (childrenArgsLen > 1) {
    childArray = new Array(childrenArgsLen);
    for (var i = 0; i < childrenArgsLen; i++) {
      childArray[i] = arguments[i + 2]; 
    }   
    props.children = childArray;
  }

  // Resolve default props
  if (elementClass && elementClass.defaultProps) {
    defaultProps = elementClass.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new Element(elementClass, props);
}

function renderToString(element) {
/*
  if (!isValidElement(element)) {
    console.error('Kontainer.registerElementClass: Invalid element.');
    return;
  }
*/
  return element.renderToString();  
}

function renderToArrayBuffer(element) {
  var buffer;

/*
  if (!isValidElement(element)) {
    console.error('Kontainer.registerElementClass: Invalid element.');
    return;
  }
*/

  buffer = new Uint8Array(element.size);
  return element.render(buffer);  
}

function registerElementClass(type, impl) {
  if (clazz[type]) {
    console.worn('Kontainer.registerElementClass: Overwriting element class - ' + type);
  }
  clazz[type] = impl;
  console.log('Kontainer.registerElementClass: Element class is registered - ' + type);
}

function getElementClass(type) {
  return clazz[type];
}

module.exports = {
  createElement: createElement,
  renderToString: renderToString,
  renderToArrayBuffer: renderToArrayBuffer,
  registerElementClass: registerElementClass,
  getElementClasss: getElementClass,
  IsoBmff: IsoBmff,
  WebM: WebM,
  Writer: Writer,
  Logger: Logger,
};
