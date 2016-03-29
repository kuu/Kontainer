'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = require('./Component');

var Element = function () {
  function Element(type, props) {
    _classCallCheck(this, Element);

    this.type = type;
    this.props = props;
    this.instance = null; // Instantiation is deferred until the rendering time.
  }

  _createClass(Element, [{
    key: 'querySelector',
    value: function querySelector(type) {
      var queue = [this];
      var element = undefined;

      while (element = queue.shift()) {
        if (type === element.type.COMPACT_NAME) {
          return element;
        }
        var children = element.props.children;
        if (children) {
          children.forEach(function (child) {
            queue.push(child);
          });
        }
      }
      return null;
    }
  }]);

  return Element;
}();

function extractChild(child, childArray) {
  if (child instanceof Element) {
    childArray.push(child);
  } else if (child instanceof Array) {
    child.forEach(function (item) {
      extractChild(item, childArray);
    });
  }
}

function isValidComponentClass(type) {
  var proto = type.prototype;

  if (proto instanceof Component && typeof proto.serialize === 'function' && typeof proto.getSize === 'function' && typeof proto.setSize === 'function') {
    return true;
  }
  return false;
}

function createElement(type, props, children) {
  var childrenArgsLen = arguments.length - 2,
      childArray = [],
      defaultProps;

  props = props || {};

  // Validate type
  if (!isValidComponentClass(type)) {
    console.error('MediaFormat.createElement: the class does not implement necessary methods.');
    return null;
  }

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
    Object.keys(defaultProps).forEach(function (key) {
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