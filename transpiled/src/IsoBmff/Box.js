'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = require('../core/Component'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var Box = function (_Component) {
  _inherits(Box, _Component);

  function Box(type, props) {
    _classCallCheck(this, Box);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Box).call(this, type, props));

    _this.size = 0;
    return _this;
  }

  _createClass(Box, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- Box.serialize enter.');
      var base = offset,
          size = this.size,
          type = this.type;

      if (size < 4294967296) {
        base += Writer.writeNumber(size, buffer, base, 4);
      } else {
        console.error('IsoBmff.Box.serialize: largesize(>4GB) is not supported.');
        return 0;
      }

      base += Writer.writeString(type, buffer, base, 4);

      if (type === 'uuid') {
        base += Writer.writeString(this.props.extendedType, buffer, base, 16);
      }

      this.size = base - offset;

      //console.log(`--- Box.serialize exit. size=${this.size}`);
      return this.size;
    }
  }, {
    key: 'getSize',
    value: function getSize() {
      return this.size;
    }
  }, {
    key: 'setSize',
    value: function setSize(size, buffer) {
      var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      if (size < 4294967296) {
        Writer.writeNumber(size, buffer, offset, 4);
      } else {
        console.error('IsoBmff.Box.serialize: largesize(>4GB) is not supported.');
        return 0;
      }
      this.size = size;
    }

    // Parses buffer and returns props.

  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var LENGTH = buffer.length;

      var size = undefined;
      var type = undefined;
      var extendedType = undefined;
      var base = offset;
      var readNum = undefined;

      // Read size.

      var _Reader$readNumber = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readNum = _Reader$readNumber2[0];
      size = _Reader$readNumber2[1];

      base += readNum;
      // Read boxType.

      var _Reader$readString = Reader.readString(buffer, base, 4);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readNum = _Reader$readString2[0];
      type = _Reader$readString2[1];

      base += readNum;

      if (size === 0) {
        // box extends to end of file
        void 0;
      } else if (size === 1) {
        var _Reader$readNumber3 = Reader.readNumber(buffer, base, 8);
        // 64bit largesize


        var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

        readNum = _Reader$readNumber4[0];
        size = _Reader$readNumber4[1];

        base += readNum;
      }

      if (type === 'uuid') {
        var _Reader$readString3 = Reader.readString(buffer, base, 16);

        var _Reader$readString4 = _slicedToArray(_Reader$readString3, 2);

        readNum = _Reader$readString4[0];
        extendedType = _Reader$readString4[1];

        base += 16;
      }

      return [base - offset, {
        size: size,
        type: type,
        extendedType: extendedType
      }];
    }
  }]);

  return Box;
}(Component);

Box.QUANTITY_ANY_NUMBER = 0;
Box.QUANTITY_EXACTLY_ONE = 1;
Box.QUANTITY_ZERO_OR_ONE = 2;

module.exports = Box;