'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var MPEG4BitRateBox = (function (_Box) {
  _inherits(MPEG4BitRateBox, _Box);

  function MPEG4BitRateBox(props) {
    _classCallCheck(this, MPEG4BitRateBox);

    _get(Object.getPrototypeOf(MPEG4BitRateBox.prototype), 'constructor', this).call(this, MPEG4BitRateBox.COMPACT_NAME, props);
  }

  _createClass(MPEG4BitRateBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- MPEG4BitRateBox.serialize enter.');
      var props = this.props,
          bufferSizeDB = props.bufferSizeDB,
          maxBitrate = props.maxBitrate,
          avgBitrate = props.avgBitrate,
          base = offset;

      base += _get(Object.getPrototypeOf(MPEG4BitRateBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(bufferSizeDB, buffer, base, 4);
      base += Writer.writeNumber(maxBitrate, buffer, base, 4);
      base += Writer.writeNumber(avgBitrate, buffer, base, 4);

      _get(Object.getPrototypeOf(MPEG4BitRateBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- MPEG4BitRateBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          bufferSizeDB,
          maxBitrate,
          avgBitrate;

      var _Box$parse = Box.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      bufferSizeDB = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      maxBitrate = _Reader$readNumber32[1];

      base += readBytesNum;

      var _Reader$readNumber4 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

      readBytesNum = _Reader$readNumber42[0];
      avgBitrate = _Reader$readNumber42[1];

      base += readBytesNum;

      props.bufferSizeDB = bufferSizeDB;
      props.maxBitrate = maxBitrate;
      props.avgBitrate = avgBitrate;

      return [base - offset, props];
    }
  }]);

  return MPEG4BitRateBox;
})(Box);

MPEG4BitRateBox.COMPACT_NAME = 'btrt';

MPEG4BitRateBox.propTypes = {
  bufferSizeDB: PropTypes.number.isRequired,
  maxBitrate: PropTypes.number.isRequired,
  avgBitrate: PropTypes.number.isRequired
};

MPEG4BitRateBox.spec = {
  container: 'avc1',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = MPEG4BitRateBox;