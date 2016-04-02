"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = function () {
  function Buffer(param) {
    _classCallCheck(this, Buffer);

    if (global && global.Buffer) {
      this.buffer = new global.Buffer(param);
    } else {
      this.buffer = new Uint8Array(param);
    }
  }

  _createClass(Buffer, [{
    key: "getView",
    value: function getView() {
      return this.buffer;
    }
  }, {
    key: "getData",
    value: function getData() {
      var buf = this.buffer;
      if (global && global.Buffer && buf instanceof global.Buffer) {
        return buf;
      } else {
        return buf.buffer;
      }
    }
  }, {
    key: "getLength",
    value: function getLength() {
      if (global && global.Buffer) {
        return this.buffer.length;
      } else {
        return this.buffer.byteLength;
      }
    }
  }]);

  return Buffer;
}();

exports.default = Buffer;