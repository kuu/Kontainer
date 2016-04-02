"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
  function Component(type, props) {
    _classCallCheck(this, Component);

    this.type = type;
    this.props = props;
  }

  // To be overridden


  _createClass(Component, [{
    key: "serialize",


    // To be overridden
    value: function serialize(buffer, offset) {
      void offset;
    }

    // To be overridden

  }, {
    key: "getSize",
    value: function getSize() {}

    // To be overridden

  }, {
    key: "setSize",
    value: function setSize(size, buffer, offset) {
      void offset;
    }

    // To be overridden

  }, {
    key: "toString",
    value: function toString(context) {
      void context;
    }

    // To be overridden

  }], [{
    key: "validate",
    value: function validate(context, props) {
      void props;
      return null;
    }
  }, {
    key: "parse",
    value: function parse(buffer, offset) {
      void offset;
    }
  }]);

  return Component;
}();

exports.default = Component;