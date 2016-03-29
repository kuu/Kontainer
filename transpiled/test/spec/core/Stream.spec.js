'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Stream = require('../../../src/core/Stream');

var _Buffer = require('../../../src/core/Buffer');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe('Stream', function () {
  describe('TransformStream', function () {
    var InputStream = undefined;
    var OutputStream = undefined;
    var sourceBuffer = undefined;

    if (global && global.Buffer) {
      var streams = require('stream');
      var Readable = streams.Readable;
      var Writable = streams.Writable;

      var NodeInputStream = function (_Readable) {
        _inherits(NodeInputStream, _Readable);

        function NodeInputStream(options) {
          _classCallCheck(this, NodeInputStream);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeInputStream).call(this, options));

          _this.finished = false;
          _this.count = 0;
          return _this;
        }

        return NodeInputStream;
      }(Readable);

      var NodeOutputStream = function (_Writable) {
        _inherits(NodeOutputStream, _Writable);

        function NodeOutputStream(cb, options) {
          _classCallCheck(this, NodeOutputStream);

          var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeOutputStream).call(this, options));

          _this2.data = null;
          _this2.on('finish', function () {
            var data = _this2.data;
            expect(data.length).toEqual(sourceBuffer.length);
            for (var i = 0; i < data.length; i++) {
              expect(data[i]).toEqual(sourceBuffer[i] * 2);
            }
            cb();
          });
          return _this2;
        }

        _createClass(NodeOutputStream, [{
          key: '_write',
          value: function _write(chunk, encoding, done) {
            if (this.data) {
              this.data = Buffer.concat([this.data, chunk]);
            } else {
              this.data = chunk;
            }
            done();
          }
        }]);

        return NodeOutputStream;
      }(Writable);

      InputStream = NodeInputStream;
      OutputStream = NodeOutputStream;

      sourceBuffer = new Buffer(256);
      for (var i = 0; i < 256; i++) {
        sourceBuffer[i] = Math.floor(i / 2);
      }
    } else {
      // TODO WhatWG's streams
    }

    var transform = undefined;

    beforeEach(function () {

      transform = new _Stream.TransformStream(function (buffer, offset, done) {
        var length = buffer.getLength();
        var doubled = new _Buffer2.default(length - offset);
        var oldBuf = buffer.getData();
        var newBuf = doubled.getData();
        for (var i = offset; i < length; i++) {
          newBuf[i - offset] = oldBuf[i] * 2;
        }
        done(null, doubled);
      });
    });

    it('can transform data', function (cb) {
      if (global && global.Buffer) {
        InputStream.prototype._read = function (size) {
          if (this.finished) {
            this.push(null);
          } else {
            this.push(sourceBuffer);
            this.finished = true;
          }
        };

        var input = new InputStream();
        var output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      } else {
        // TODO (WhatWG's streams)
      }
    });

    it('can pause and resume', function (cb) {
      if (global && global.Buffer) {
        InputStream.prototype._read = function (size) {
          var count = this.count;
          if (count === 2) {
            this.push(null);
          } else {
            if (count === 0) {
              this.push(sourceBuffer.slice(0, 128));
            } else {
              this.push(sourceBuffer.slice(128, 256));
            }
            this.count++;
          }
        };

        var input = new InputStream();
        var output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      } else {
        // TODO (WhatWG's streams)
      }
    });
  });
});