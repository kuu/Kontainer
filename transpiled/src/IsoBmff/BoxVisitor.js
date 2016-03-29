'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IsoBmffDumpVisitor = exports.BoxVisitor = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Visitor2 = require('../core/Visitor');

var _Visitor3 = _interopRequireDefault(_Visitor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BoxVisitor = function (_Visitor) {
  _inherits(BoxVisitor, _Visitor);

  function BoxVisitor() {
    _classCallCheck(this, BoxVisitor);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BoxVisitor).apply(this, arguments));
  }

  _createClass(BoxVisitor, [{
    key: 'enter',
    value: function enter(type, props) {
      // To be overriddedn
    }
  }, {
    key: 'exit',
    value: function exit(type, props, children) {
      // To be overriddedn
    }
  }]);

  return BoxVisitor;
}(_Visitor3.default);

var IsoBmffDumpVisitor = function (_BoxVisitor) {
  _inherits(IsoBmffDumpVisitor, _BoxVisitor);

  function IsoBmffDumpVisitor() {
    _classCallCheck(this, IsoBmffDumpVisitor);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(IsoBmffDumpVisitor).apply(this, arguments));
  }

  _createClass(IsoBmffDumpVisitor, [{
    key: 'enter',
    value: function enter(type, props) {
      var depth = this.depth();
      console.log(IsoBmffDumpVisitor.padding(depth) + '[' + type.COMPACT_NAME + '] >>>> start');
      Object.keys(props).forEach(function (key) {
        var value = props[key];
        if (value instanceof Array) {
          value = IsoBmffDumpVisitor.formatArray(value);
        } else {
          value = IsoBmffDumpVisitor.formatValue(value);
        }
        console.log(IsoBmffDumpVisitor.padding(depth) + '\t' + key + ': ' + value);
      });
    }
  }, {
    key: 'exit',
    value: function exit(type) {
      var depth = this.depth();
      console.log(IsoBmffDumpVisitor.padding(depth) + '[' + type.COMPACT_NAME + '] <<<< end');
    }
  }], [{
    key: 'formatBuffer',
    value: function formatBuffer(v) {
      if (global && global.Buffer) {
        return '[Buffer length=' + v.length + ']';
      }
      return v;
    }
  }, {
    key: 'isBuffer',
    value: function isBuffer(v) {
      if (global && global.Buffer) {
        return v instanceof global.Buffer;
      }
      return v instanceof ArrayBuffer;
    }
  }, {
    key: 'padding',
    value: function padding(num) {
      var str = '';
      for (var i = 0; i < num; i++) {
        str += '\t';
      }
      return str;
    }
  }, {
    key: 'formatValue',
    value: function formatValue(v) {
      var str;
      if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && !(v instanceof Date) && !IsoBmffDumpVisitor.isBuffer(v)) {
        str = '{';
        Object.keys(v).forEach(function (key) {
          str += key + ': ' + IsoBmffDumpVisitor.formatValue(v[key]) + ', ';
        });
        return str + '}';
      }
      if (typeof v === 'string') {
        return '"' + v + '"';
      }
      if (IsoBmffDumpVisitor.isBuffer(v)) {
        return IsoBmffDumpVisitor.formatBuffer(v);
      }
      return v;
    }
  }, {
    key: 'formatArray',
    value: function formatArray(a) {
      var str = '[ ';
      if (a.length > 100) {
        return str + ('array of length=' + a.length + ']');
      }
      a.forEach(function (v) {
        if (v instanceof Array) {
          str += IsoBmffDumpVisitor.formatArray(v);
        } else {
          str += IsoBmffDumpVisitor.formatValue(v);
        }
        str += ', ';
      });
      return str + ' ]';
    }
  }]);

  return IsoBmffDumpVisitor;
}(BoxVisitor);

exports.BoxVisitor = BoxVisitor;
exports.IsoBmffDumpVisitor = IsoBmffDumpVisitor;