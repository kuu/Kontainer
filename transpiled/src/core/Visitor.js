"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Base class for the Visitor pattern.

var Visitor = function () {
  function Visitor() {
    _classCallCheck(this, Visitor);

    this.stack = [];
    this.offset = 0;
  }

  // This method will be called when entering a node.


  _createClass(Visitor, [{
    key: "enter",
    value: function enter(type, props) {}
    // To be overridden


    // This method will be called when exiting a node.
    // The return value will be stored in the children property of the parent node.

  }, {
    key: "exit",
    value: function exit(type, props, children) {}
    // To be overridden


    // You can attach any data to the current stack.
    // Usually, this is called within enter() method.

  }, {
    key: "setData",
    value: function setData(data) {
      var len = this.stack.length;
      if (len > 0) {
        this.stack[len - 1].userData = data;
      }
    }

    // Usually, this is called within exit() method.

  }, {
    key: "getData",
    value: function getData() {
      var len = this.stack.length;
      if (len === 0) {
        return null;
      }
      return this.stack[len - 1].userData;
    }
  }, {
    key: "depth",
    value: function depth() {
      return this.stack.length - 1;
    }
  }]);

  return Visitor;
}();

exports.default = Visitor;