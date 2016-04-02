'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

var _Buffer = require('../../../src/core/Buffer');

var _Buffer2 = _interopRequireDefault(_Buffer);

var _BoxVisitor2 = require('../../../src/IsoBmff/BoxVisitor');

var _IsoBmff = require('../../helper/IsoBmff');

var _IsoBmff2 = _interopRequireDefault(_IsoBmff);

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IsoBmff = _src2.default.IsoBmff;
var ELEMENT = _IsoBmff2.default.element;
var BUFFER = _IsoBmff2.default.buffer;
var ELEMENT_NUM = 22;

describe('IsoBmff', function () {

  describe('querySelector', function () {

    it('can find the root node', function () {
      var root = ELEMENT.querySelector('file');
      expect(root.type.COMPACT_NAME).toEqual('file');
    });

    it('can find a leaf node', function () {
      var leaf = ELEMENT.querySelector('avcC');
      expect(leaf.type.COMPACT_NAME).toEqual('avcC');
    });

    it('can find a middle node', function () {
      var mid = ELEMENT.querySelector('mdia');
      expect(mid.type.COMPACT_NAME).toEqual('mdia');
    });

    it('can search a partial tree', function () {
      var mid = ELEMENT.querySelector('trak');
      var leaf = mid.querySelector('urn ');
      expect(leaf.type.COMPACT_NAME).toEqual('urn ');
    });
  });

  if (global && global.Buffer) {
    // Node only
    describe('transform', function () {

      var streams = require('stream');
      var Readable = streams.Readable;
      var Writable = streams.Writable;
      var buffer = new _Buffer2.default(BUFFER).getData();

      var fakeFuncs = {
        enterCounter: function enterCounter() {},
        exitCounter: function exitCounter() {}
      };

      beforeEach(function () {
        spyOn(fakeFuncs, 'enterCounter');
        spyOn(fakeFuncs, 'exitCounter');
      });

      var InputStream = function (_Readable) {
        _inherits(InputStream, _Readable);

        function InputStream(options) {
          _classCallCheck(this, InputStream);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(InputStream).call(this, options));

          _this.finished = false;
          _this.count = 0;
          return _this;
        }

        return InputStream;
      }(Readable);

      var OutputStream = function (_Writable) {
        _inherits(OutputStream, _Writable);

        function OutputStream(cb, options) {
          _classCallCheck(this, OutputStream);

          var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(OutputStream).call(this, options));

          _this2.data = null;
          _this2.on('finish', function () {
            expect(fakeFuncs.enterCounter.calls.length).toEqual(ELEMENT_NUM);
            expect(fakeFuncs.exitCounter.calls.length).toEqual(ELEMENT_NUM);
            cb();
          });
          return _this2;
        }

        _createClass(OutputStream, [{
          key: '_write',
          value: function _write(chunk, encoding, done) {
            done();
          }
        }]);

        return OutputStream;
      }(Writable);

      var TestVisitor = function (_BoxVisitor) {
        _inherits(TestVisitor, _BoxVisitor);

        function TestVisitor() {
          _classCallCheck(this, TestVisitor);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(TestVisitor).apply(this, arguments));
        }

        _createClass(TestVisitor, [{
          key: 'enter',
          value: function enter(type, props) {
            fakeFuncs.enterCounter();
            _matcher2.default.toHaveTheSamePropsAs(ELEMENT.querySelector(type.COMPACT_NAME), { props: props });
          }
        }, {
          key: 'exit',
          value: function exit(type, props, children) {
            fakeFuncs.exitCounter();
          }
        }]);

        return TestVisitor;
      }(_BoxVisitor2.BoxVisitor);

      it('can parse full buffer', function (cb) {
        var visitor = new TestVisitor();

        InputStream.prototype._read = function (size) {
          if (this.finished) {
            this.push(null);
          } else {
            this.push(buffer);
            this.finished = true;
          }
        };

        var input = new InputStream();
        var transform = IsoBmff.transform(visitor);
        var output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      });

      it('can pause (just between boxes)', function (cb) {
        var visitor = new TestVisitor();

        InputStream.prototype._read = function (size) {
          var count = this.count;
          if (count === 2) {
            this.push(null);
          } else {
            if (count === 0) {
              this.push(buffer.slice(0, 132));
            } else {
              this.push(buffer.slice(132, buffer.length));
            }
            this.count++;
          }
        };

        var input = new InputStream();
        var transform = IsoBmff.transform(visitor);
        var output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      });

      it('can pause (in the middle of box)', function (cb) {
        var visitor = new TestVisitor();

        InputStream.prototype._read = function (size) {
          var count = this.count;
          if (count === 2) {
            this.push(null);
          } else {
            if (count === 0) {
              this.push(buffer.slice(0, 172));
            } else {
              this.push(buffer.slice(172, buffer.length));
            }
            this.count++;
          }
        };

        var input = new InputStream();
        var transform = IsoBmff.transform(visitor);
        var output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      });
    });
  }
});