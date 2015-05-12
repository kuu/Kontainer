'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var TrackExtendsBox = (function (_FullBox) {
  function TrackExtendsBox(props) {
    _classCallCheck(this, TrackExtendsBox);

    _get(Object.getPrototypeOf(TrackExtendsBox.prototype), 'constructor', this).call(this, TrackExtendsBox.COMPACT_NAME, props, 0, 0);
  }

  _inherits(TrackExtendsBox, _FullBox);

  _createClass(TrackExtendsBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackExtendsBox.serialize enter.');
      var props = this.props,
          trackId = props.trackId,
          defaultSampleDescriptionIndex = props.defaultSampleDescriptionIndex,
          defaultSampleDuration = props.defaultSampleDuration,
          defaultSampleSize = props.defaultSampleSize,
          defaultSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.defaultSampleFlags),
          base = offset;

      base += _get(Object.getPrototypeOf(TrackExtendsBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(trackId, buffer, base, 4);
      base += Writer.writeNumber(defaultSampleDescriptionIndex, buffer, base, 4);
      base += Writer.writeNumber(defaultSampleDuration, buffer, base, 4);
      base += Writer.writeNumber(defaultSampleSize, buffer, base, 4);
      base += Writer.writeNumber(defaultSampleFlags, buffer, base, 4);

      _get(Object.getPrototypeOf(TrackExtendsBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TrackExtendsBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeDefaultSampleFlags',
    value: function encodeDefaultSampleFlags(flags) {
      var f = 0;

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

      v = f >>> 6 & 3;
      if (v === 0) {
        flags.sampleDependsOn = 'unknown';
      } else if (v === 1) {
        flags.sampleDependsOn = 'non-I-picture';
      } else if (v === 2) {
        flags.sampleDependsOn = 'I-picture';
      }

      v = f >>> 8 & 3;
      if (v === 0) {
        flags.sampleIsDependedOn = 'unknown';
      } else if (v === 1) {
        flags.sampleIsDependedOn = 'non-disposable';
      } else if (v === 2) {
        flags.sampleIsDependedOn = 'disposable';
      }

      v = f >>> 10 & 3;
      if (v === 0) {
        flags.sampleHasRedundancy = 'unknown';
      } else if (v === 1) {
        flags.sampleHasRedundancy = 'redundant';
      } else if (v === 2) {
        flags.sampleHasRedundancy = 'no-redundant';
      }

      flags.samplePaddingValue = f >>> 12 & 7;
      flags.sampleIsDifferenceSample = !!(f >>> 15 & 1);
      flags.sampleDegradationPriority = f >>> 16 & 65535;

      return flags;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          trackId,
          defaultSampleDescriptionIndex,
          defaultSampleDuration,
          defaultSampleSize,
          defaultSampleFlags;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      trackId = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      defaultSampleDescriptionIndex = _Reader$readNumber32[1];

      base += readBytesNum;

      var _Reader$readNumber4 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

      readBytesNum = _Reader$readNumber42[0];
      defaultSampleDuration = _Reader$readNumber42[1];

      base += readBytesNum;

      var _Reader$readNumber5 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber52 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber52[0];
      defaultSampleSize = _Reader$readNumber52[1];

      base += readBytesNum;

      var _Reader$readNumber6 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber62 = _slicedToArray(_Reader$readNumber6, 2);

      readBytesNum = _Reader$readNumber62[0];
      defaultSampleFlags = _Reader$readNumber62[1];

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
})(FullBox);

TrackExtendsBox.COMPACT_NAME = 'trex';

TrackExtendsBox.propTypes = {
  trackId: PropTypes.number.isRequired,
  defaultSampleDescriptionIndex: PropTypes.number.isRequired,
  defaultSampleDuration: PropTypes.number.isRequired,
  defaultSampleSize: PropTypes.number.isRequired,
  defaultSampleFlags: PropTypes.shape({
    sampleDependsOn: PropTypes.oneOf(['unknown', 'non-I-picture', 'I-picture']),
    sampleIsDependedOn: PropTypes.oneOf(['unknown', 'non-disposable', 'disposable']),
    sampleHasRedundancy: PropTypes.oneOf(['unknown', 'redundant', 'no-redundant']),
    samplePaddingValue: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7]),
    sampleIsDifferenceSample: PropTypes.bool,
    sampleDegradationPriority: PropTypes.number
  }).isRequired
};

TrackExtendsBox.defaultProps = {
  version: 0
};

TrackExtendsBox.spec = {
  container: 'mvex',
  quantity: Box.QUANTITY_ANY_NUMBER, // Actually exactly one for each track.
  mandatoryBoxList: []
};

module.exports = TrackExtendsBox;