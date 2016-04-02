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

var VisualSampleEntry = function (_SampleEntry) {
  _inherits(VisualSampleEntry, _SampleEntry);

  function VisualSampleEntry(type, props) {
    _classCallCheck(this, VisualSampleEntry);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(VisualSampleEntry).call(this, type, props, props.dataReferenceIndex));
  }

  _createClass(VisualSampleEntry, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- VisualSampleEntry.serialize enter.');
      var props = this.props;
      var width = props.width;
      var height = props.height;
      var horizResolution = props.horizResolution;
      var vertResolution = props.vertResolution;
      var frameCount = props.frameCount;
      var compressorName = props.compressorName;
      var depth = props.depth;

      var base = offset;

      base += _get(Object.getPrototypeOf(VisualSampleEntry.prototype), 'serialize', this).call(this, buffer, base);

      base += _Writer2.default.writeNumber(0, buffer, base, 16); // reserved (32)[4]
      base += _Writer2.default.writeNumber(width, buffer, base, 2);
      base += _Writer2.default.writeNumber(height, buffer, base, 2);
      base += _Writer2.default.writeFixedNumber(horizResolution, buffer, base, 4);
      base += _Writer2.default.writeFixedNumber(vertResolution, buffer, base, 4);
      base += _Writer2.default.writeNumber(0, buffer, base, 4); // reserved (32)
      base += _Writer2.default.writeNumber(frameCount, buffer, base, 2);
      base += _Writer2.default.writeNumber(Math.min(compressorName.length, 31), buffer, base, 1);
      base += _Writer2.default.writeString(compressorName, buffer, base, 31);
      base += _Writer2.default.writeNumber(depth, buffer, base, 2);
      base += _Writer2.default.writeNumber(-1, buffer, base, 2); // pre_defined=-1 (16)

      _get(Object.getPrototypeOf(VisualSampleEntry.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log('--- VisualSampleEntry.serialize exit.');
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          width = undefined,
          height = undefined,
          horizResolution = undefined,
          vertResolution = undefined,
          frameCount = undefined,
          compressorName = undefined,
          compressorNameLength = undefined,
          depth = undefined;

      var _SampleEntry$parse = _SampleEntry3.default.parse(buffer, base);

      var _SampleEntry$parse2 = _slicedToArray(_SampleEntry$parse, 2);

      readBytesNum = _SampleEntry$parse2[0];
      props = _SampleEntry$parse2[1];

      base += readBytesNum;

      base += 16; // skip reserved

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      width = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber4[0];
      height = _Reader$readNumber4[1];

      base += readBytesNum;

      var _Reader$readFixedNumb = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb2 = _slicedToArray(_Reader$readFixedNumb, 2);

      readBytesNum = _Reader$readFixedNumb2[0];
      horizResolution = _Reader$readFixedNumb2[1];

      base += readBytesNum;

      var _Reader$readFixedNumb3 = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb4 = _slicedToArray(_Reader$readFixedNumb3, 2);

      readBytesNum = _Reader$readFixedNumb4[0];
      vertResolution = _Reader$readFixedNumb4[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readNumber5 = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber6[0];
      frameCount = _Reader$readNumber6[1];

      base += readBytesNum;

      var _Reader$readNumber7 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber8[0];
      compressorNameLength = _Reader$readNumber8[1];

      base += readBytesNum;

      var _Reader$readString = _Reader2.default.readString(buffer, base, Math.min(compressorNameLength, 31));

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      compressorName = _Reader$readString2[1];

      base += 31;

      var _Reader$readNumber9 = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber10 = _slicedToArray(_Reader$readNumber9, 2);

      readBytesNum = _Reader$readNumber10[0];
      depth = _Reader$readNumber10[1];

      base += readBytesNum;

      base += 2; // skip pre_defined

      props.width = width;
      props.height = height;
      props.horizResolution = horizResolution;
      props.vertResolution = vertResolution;
      props.frameCount = frameCount;
      props.compressorName = compressorName;
      props.depth = depth;

      return [base - offset, props];
    }
  }]);

  return VisualSampleEntry;
}(_SampleEntry3.default);

exports.default = VisualSampleEntry;