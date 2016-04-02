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

var TrackExtendsBox = function (_FullBox) {
  _inherits(TrackExtendsBox, _FullBox);

  function TrackExtendsBox(props) {
    _classCallCheck(this, TrackExtendsBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TrackExtendsBox).call(this, TrackExtendsBox.COMPACT_NAME, props, 0, 0));
  }

  _createClass(TrackExtendsBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackExtendsBox.serialize enter.');
      var props = this.props,
          trackId = props.trackId,
          defaultSampleDescriptionIndex = props.defaultSampleDescriptionIndex,
          defaultSampleDuration = props.defaultSampleDuration,
          defaultSampleSize = props.defaultSampleSize,
          defaultSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.defaultSampleFlags),
          base = offset;

      base += _get(Object.getPrototypeOf(TrackExtendsBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeNumber(trackId, buffer, base, 4);
      base += _Writer2.default.writeNumber(defaultSampleDescriptionIndex, buffer, base, 4);
      base += _Writer2.default.writeNumber(defaultSampleDuration, buffer, base, 4);
      base += _Writer2.default.writeNumber(defaultSampleSize, buffer, base, 4);
      base += _Writer2.default.writeNumber(defaultSampleFlags, buffer, base, 4);

      _get(Object.getPrototypeOf(TrackExtendsBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TrackExtendsBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeDefaultSampleFlags',
    value: function encodeDefaultSampleFlags(flags) {
      var f = 0;

      if (!flags) {
        return void 0;
      }

      if (flags.sampleDependsOn === 'unknown') {
        f |= 0 << 6;
      } else if (flags.sampleDependsOn === 'non-I-picture') {
        f |= 1 << 6;
      } else if (flags.sampleDependsOn === 'I-picture') {
        f |= 2 << 6;
      }

      if (flags.sampleIsDependedOn === 'unknown') {
        f |= 0 << 8;
      } else if (flags.sampleIsDependedOn === 'non-disposable') {
        f |= 1 << 8;
      } else if (flags.sampleIsDependedOn === 'disposable') {
        f |= 2 << 8;
      }

      if (flags.sampleHasRedundancy === 'unknown') {
        f |= 0 << 10;
      } else if (flags.sampleHasRedundancy === 'redundant') {
        f |= 1 << 10;
      } else if (flags.sampleHasRedundancy === 'no-redundant') {
        f |= 2 << 10;
      }

      f |= flags.samplePaddingValue << 12;
      f |= flags.sampleIsDifferenceSample << 15;
      f |= flags.sampleDegradationPriority << 16;

      return f;
    }
  }, {
    key: 'decodeDefaultSampleFlags',
    value: function decodeDefaultSampleFlags(f) {
      var flags = {
        sampleDependsOn: '',
        sampleIsDependedOn: '',
        sampleHasRedundancy: '',
        samplePaddingValue: 0,
        sampleIsDifferenceSample: false,
        sampleDegradationPriority: 0
      },
          v;

      v = f >>> 6 & 0x03;
      if (v === 0) {
        flags.sampleDependsOn = 'unknown';
      } else if (v === 1) {
        flags.sampleDependsOn = 'non-I-picture';
      } else if (v === 2) {
        flags.sampleDependsOn = 'I-picture';
      }

      v = f >>> 8 & 0x03;
      if (v === 0) {
        flags.sampleIsDependedOn = 'unknown';
      } else if (v === 1) {
        flags.sampleIsDependedOn = 'non-disposable';
      } else if (v === 2) {
        flags.sampleIsDependedOn = 'disposable';
      }

      v = f >>> 10 & 0x03;
      if (v === 0) {
        flags.sampleHasRedundancy = 'unknown';
      } else if (v === 1) {
        flags.sampleHasRedundancy = 'redundant';
      } else if (v === 2) {
        flags.sampleHasRedundancy = 'no-redundant';
      }

      flags.samplePaddingValue = f >>> 12 & 0x07;
      flags.sampleIsDifferenceSample = !!(f >>> 15 & 0x01);
      flags.sampleDegradationPriority = f >>> 16 & 0xFFFF;

      return flags;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          trackId,
          defaultSampleDescriptionIndex,
          defaultSampleDuration,
          defaultSampleSize,
          defaultSampleFlags;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      trackId = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber4[0];
      defaultSampleDescriptionIndex = _Reader$readNumber4[1];

      base += readBytesNum;

      var _Reader$readNumber5 = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber6[0];
      defaultSampleDuration = _Reader$readNumber6[1];

      base += readBytesNum;

      var _Reader$readNumber7 = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber8[0];
      defaultSampleSize = _Reader$readNumber8[1];

      base += readBytesNum;

      var _Reader$readNumber9 = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber10 = _slicedToArray(_Reader$readNumber9, 2);

      readBytesNum = _Reader$readNumber10[0];
      defaultSampleFlags = _Reader$readNumber10[1];

      base += readBytesNum;

      props.trackId = trackId;
      props.trackId = trackId;
      props.defaultSampleDescriptionIndex = defaultSampleDescriptionIndex;
      props.defaultSampleDuration = defaultSampleDuration;
      props.defaultSampleSize = defaultSampleSize;
      props.defaultSampleFlags = TrackExtendsBox.decodeDefaultSampleFlags(defaultSampleFlags);

      return [base - offset, props];
    }
  }]);

  return TrackExtendsBox;
}(_FullBox3.default);

exports.default = TrackExtendsBox;


TrackExtendsBox.COMPACT_NAME = 'trex';

TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES = _PropTypes2.default.shape({
  sampleDependsOn: _PropTypes2.default.oneOf(['unknown', 'non-I-picture', 'I-picture']),
  sampleIsDependedOn: _PropTypes2.default.oneOf(['unknown', 'non-disposable', 'disposable']),
  sampleHasRedundancy: _PropTypes2.default.oneOf(['unknown', 'redundant', 'no-redundant']),
  samplePaddingValue: _PropTypes2.default.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
  sampleIsDifferenceSample: _PropTypes2.default.bool,
  sampleDegradationPriority: _PropTypes2.default.number
});

TrackExtendsBox.propTypes = {
  trackId: _PropTypes2.default.number.isRequired,
  defaultSampleDescriptionIndex: _PropTypes2.default.number.isRequired,
  defaultSampleDuration: _PropTypes2.default.number.isRequired,
  defaultSampleSize: _PropTypes2.default.number.isRequired,
  defaultSampleFlags: TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES.isRequired
};

TrackExtendsBox.defaultProps = {
  version: 0
};

TrackExtendsBox.spec = {
  container: 'mvex',
  quantity: _Box2.default.QUANTITY_ANY_NUMBER, // Actually exactly one for each track.
  mandatoryBoxList: []
};