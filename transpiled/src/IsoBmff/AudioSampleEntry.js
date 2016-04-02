'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SampleEntry2 = require('./SampleEntry');

var _SampleEntry3 = _interopRequireDefault(_SampleEntry2);

var _Writer = require('../core/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Reader = require('../core/Reader');

var _Reader2 = _interopRequireDefault(_Reader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioSampleEntry = function (_SampleEntry) {
  _inherits(AudioSampleEntry, _SampleEntry);

  function AudioSampleEntry(type, props) {
    _classCallCheck(this, AudioSampleEntry);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AudioSampleEntry).call(this, type, props, props.dataReferenceIndex));
  }

  _createClass(AudioSampleEntry, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- AudioSampleEntry.serialize enter.');
      var props = this.props,
          channelCount = props.channelCount,
          sampleSize = props.sampleSize,
          sampleRate = props.sampleRate,
          base = offset;

      base += _get(Object.getPrototypeOf(AudioSampleEntry.prototype), 'serialize', this).call(this, buffer, base);

      base += _Writer2.default.writeNumber(0, buffer, base, 8); // reserved (32)[2]
      base += _Writer2.default.writeNumber(channelCount, buffer, base, 2);
      base += _Writer2.default.writeNumber(sampleSize, buffer, base, 2);
      base += _Writer2.default.writeNumber(0, buffer, base, 4); // reserved (32)
      base += _Writer2.default.writeFixedNumber(sampleRate, buffer, base, 4);

      _get(Object.getPrototypeOf(AudioSampleEntry.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log('--- AudioSampleEntry.serialize exit.');
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          channelCount,
          sampleSize,
          sampleRate;

      var _SampleEntry$parse = _SampleEntry3.default.parse(buffer, base);

      var _SampleEntry$parse2 = _slicedToArray(_SampleEntry$parse, 2);

      readBytesNum = _SampleEntry$parse2[0];
      props = _SampleEntry$parse2[1];

      base += readBytesNum;

      base += 8; // skip reserved

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      channelCount = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber4[0];
      sampleSize = _Reader$readNumber4[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readFixedNumb = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb2 = _slicedToArray(_Reader$readFixedNumb, 2);

      readBytesNum = _Reader$readFixedNumb2[0];
      sampleRate = _Reader$readFixedNumb2[1];

      base += readBytesNum;

      props.channelCount = channelCount;
      props.sampleSize = sampleSize;
      props.sampleRate = sampleRate;

      return [base - offset, props];
    }
  }]);

  return AudioSampleEntry;
}(_SampleEntry3.default);

exports.default = AudioSampleEntry;