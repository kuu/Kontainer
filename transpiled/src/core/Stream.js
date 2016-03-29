'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformStream = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Buffer = require('./Buffer');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TransformStream = undefined;

if (global && global.Buffer) {
  var Transform = require('stream').Transform;

  var NodeTransform = function (_Transform) {
    _inherits(NodeTransform, _Transform);

    function NodeTransform(parser, options) {
      _classCallCheck(this, NodeTransform);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeTransform).call(this, options));

      _this.buffer = null;
      _this.offset = 0;
      _this.parser = parser;
      return _this;
    }

    _createClass(NodeTransform, [{
      key: '_transform',
      value: function _transform(chunk, encoding, done) {
        if (chunk instanceof global.Buffer) {
          if (this.buffer) {
            this.offset = this.buffer.length;
            this.buffer = global.Buffer.concat([this.buffer, chunk]);
          } else {
            this.buffer = chunk;
          }
          this.parser(new _Buffer2.default(this.buffer), this.offset, function (err, buf) {
            done(err, buf && buf.getData());
          });
        }
      }
    }, {
      key: '_flush',
      value: function _flush(done) {
        done();
      }
    }]);

    return NodeTransform;
  }(Transform);

  exports.
  // TODO (WhatWG's streams)
  TransformStream = TransformStream = NodeTransform;
} else {}

exports.TransformStream = TransformStream;