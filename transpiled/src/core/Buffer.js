"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = (function () {
  function Buffer(length) {
    _classCallCheck(this, Buffer);

    if (global && global.Buffer) {
      this.buffer = new global.Buffer(length);
    } else {
      this.buffer = new Uint8Array(length);
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
      if (buf instanceof Uint8Array) {
        return buf.buffer;
      } else {
        return buf;
      }
    }
  }]);

  return Buffer;
})();

module.exports = Buffer;