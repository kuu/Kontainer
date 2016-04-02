'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Box = require('./Box');

var _Box2 = _interopRequireDefault(_Box);

var _FullBox2 = require('./FullBox');

var _FullBox3 = _interopRequireDefault(_FullBox2);

var _TrackExtendsBox = require('./TrackExtendsBox');

var _TrackExtendsBox2 = _interopRequireDefault(_TrackExtendsBox);

var _PropTypes = require('../core/PropTypes');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

var _Writer = require('../core/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Reader = require('../core/Reader');

var _Reader2 = _interopRequireDefault(_Reader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TrackRunBox = function (_FullBox) {
  _inherits(TrackRunBox, _FullBox);

  function TrackRunBox(props) {
    _classCallCheck(this, TrackRunBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TrackRunBox).call(this, TrackRunBox.COMPACT_NAME, props, 0, TrackRunBox.encodeFlags(props)));
  }

  _createClass(TrackRunBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackRunBox.serialize enter.');
      var props = this.props,
          samples = props.samples,
          dataOffset = props.dataOffset,
          firstSampleFlags = _TrackExtendsBox2.default.encodeDefaultSampleFlags(props.firstSampleFlags),
          base = offset;

      base += _get(Object.getPrototypeOf(TrackRunBox.prototype), 'serialize', this).call(this, buffer, base);

      base += _Writer2.default.writeNumber(samples.length, buffer, base, 4);

      if (dataOffset !== void 0) {
        base += _Writer2.default.writeNumber(dataOffset, buffer, base, 4);
      }
      if (firstSampleFlags !== void 0) {
        base += _Writer2.default.writeNumber(firstSampleFlags, buffer, base, 4);
      }
      samples.forEach(function (sample) {
        if (sample.duration !== void 0) {
          base += _Writer2.default.writeNumber(sample.duration, buffer, base, 4);
        }
        if (sample.size !== void 0) {
          base += _Writer2.default.writeNumber(sample.size, buffer, base, 4);
        }
        if (sample.flags !== void 0) {
          base += _Writer2.default.writeNumber(_TrackExtendsBox2.default.encodeDefaultSampleFlags(sample.flags), buffer, base, 4);
        }
        if (sample.compositionTimeOffset !== void 0) {
          base += _Writer2.default.writeNumber(sample.compositionTimeOffset, buffer, base, 4);
        }
      });

      _get(Object.getPrototypeOf(TrackRunBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TrackRunBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeFlags',
    value: function encodeFlags(props) {
      var f = 0,
          samples = props.samples;

      if (props.dataOffset !== void 0) {
        f |= 1 << 0;
      }

      if (props.firstSampleFlags !== void 0) {
        f |= 1 << 2;
      }

      if (samples.length > 0) {
        if (samples[0].duration !== void 0) {
          f |= 1 << 8;
        }
        if (samples[0].size !== void 0) {
          f |= 1 << 9;
        }
        if (samples[0].flags !== void 0) {
          f |= 1 << 10;
        }
        if (samples[0].compositionTimeOffset !== void 0) {
          f |= 1 << 11;
        }
      }

      return f;
    }
  }, {
    key: 'decodeFlags',
    value: function decodeFlags(f) {
      var flags = {
        dataOffsetPresent: false,
        firstSampleFlagsPresent: false,
        sampleDurationPresent: false,
        sampleSizePresent: false,
        sampleFlagsPresent: false,
        sampleCompositionTimeOffsetPresent: false
      };
      if (f >> 0 & 0x01) {
        flags.dataOffsetPresent = true;
      }
      if (f >> 2 & 0x01) {
        flags.firstSampleFlagsPresent = true;
      }
      if (f >> 8 & 0x01) {
        flags.sampleDurationPresent = true;
      }
      if (f >> 9 & 0x01) {
        flags.sampleSizePresent = true;
      }
      if (f >> 10 & 0x01) {
        flags.sampleFlagsPresent = true;
      }
      if (f >> 11 & 0x01) {
        flags.sampleCompositionTimeOffsetPresent = true;
      }
      return flags;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          flags,
          sampleCount,
          samples,
          dataOffset,
          firstSampleFlags,
          sample,
          sampleDuration,
          sampleSize,
          sampleFlags,
          sampleCompositionTimeOffset;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      sampleCount = _Reader$readNumber2[1];

      base += readBytesNum;

      samples = new Array(sampleCount);

      flags = TrackRunBox.decodeFlags(props.flags);

      if (flags.dataOffsetPresent) {
        var _Reader$readNumber3 = _Reader2.default.readNumber(buffer, base, 4);

        var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

        readBytesNum = _Reader$readNumber4[0];
        dataOffset = _Reader$readNumber4[1];

        base += readBytesNum;
        props.dataOffset = dataOffset;
      }

      if (flags.firstSampleFlagsPresent) {
        var _Reader$readNumber5 = _Reader2.default.readNumber(buffer, base, 4);

        var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

        readBytesNum = _Reader$readNumber6[0];
        firstSampleFlags = _Reader$readNumber6[1];

        base += readBytesNum;
        props.firstSampleFlags = _TrackExtendsBox2.default.decodeDefaultSampleFlags(firstSampleFlags);
      }

      for (var i = 0; i < sampleCount; i++) {
        sample = samples[i] = {};

        if (flags.sampleDurationPresent) {
          var _Reader$readNumber7 = _Reader2.default.readNumber(buffer, base, 4);

          var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

          readBytesNum = _Reader$readNumber8[0];
          sampleDuration = _Reader$readNumber8[1];

          base += readBytesNum;
          sample.duration = sampleDuration;
        }

        if (flags.sampleSizePresent) {
          var _Reader$readNumber9 = _Reader2.default.readNumber(buffer, base, 4);

          var _Reader$readNumber10 = _slicedToArray(_Reader$readNumber9, 2);

          readBytesNum = _Reader$readNumber10[0];
          sampleSize = _Reader$readNumber10[1];

          base += readBytesNum;
          sample.size = sampleSize;
        }

        if (flags.sampleFlagsPresent) {
          var _Reader$readNumber11 = _Reader2.default.readNumber(buffer, base, 4);

          var _Reader$readNumber12 = _slicedToArray(_Reader$readNumber11, 2);

          readBytesNum = _Reader$readNumber12[0];
          sampleFlags = _Reader$readNumber12[1];

          base += readBytesNum;
          sample.flags = _TrackExtendsBox2.default.decodeDefaultSampleFlags(sampleFlags);
        }

        if (flags.sampleCompositionTimeOffsetPresent) {
          var _Reader$readNumber13 = _Reader2.default.readNumber(buffer, base, 4);

          var _Reader$readNumber14 = _slicedToArray(_Reader$readNumber13, 2);

          readBytesNum = _Reader$readNumber14[0];
          sampleCompositionTimeOffset = _Reader$readNumber14[1];

          base += readBytesNum;
          sample.compositionTimeOffset = sampleCompositionTimeOffset;
        }
      }

      props.samples = samples;

      return [base - offset, props];
    }
  }]);

  return TrackRunBox;
}(_FullBox3.default);

exports.default = TrackRunBox;


TrackRunBox.COMPACT_NAME = 'trun';

TrackRunBox.propTypes = {
  samples: _PropTypes2.default.arrayOf(_PropTypes2.default.object),
  dataOffset: _PropTypes2.default.number,
  firstSampleFlags: _TrackExtendsBox2.default.DEFAULT_SAMPLE_FLAGS_PROPTYPES
};

TrackRunBox.defaultProps = {
  samples: [],
  dataOffset: void 0,
  firstSampleFlags: void 0
};

TrackRunBox.spec = {
  container: 'traf',
  quantity: _Box2.default.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};