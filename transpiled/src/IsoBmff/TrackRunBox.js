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
    TrackExtendsBox = require('./TrackExtendsBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var TrackRunBox = (function (_FullBox) {
  function TrackRunBox(props) {
    _classCallCheck(this, TrackRunBox);

    _get(Object.getPrototypeOf(TrackRunBox.prototype), 'constructor', this).call(this, TrackRunBox.COMPACT_NAME, props, 0, TrackRunBox.encodeFlags(props));
  }

  _inherits(TrackRunBox, _FullBox);

  _createClass(TrackRunBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackRunBox.serialize enter.');
      var props = this.props,
          samples = props.samples,
          dataOffset = props.dataOffset,
          firstSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.firstSampleFlags),
          base = offset;

      base += _get(Object.getPrototypeOf(TrackRunBox.prototype), 'serialize', this).call(this, buffer, base);

      base += Writer.writeNumber(samples.length, buffer, base, 4);

      if (dataOffset !== void 0) {
        base += Writer.writeNumber(dataOffset, buffer, base, 4);
      }
      if (firstSampleFlags !== void 0) {
        base += Writer.writeNumber(firstSampleFlags, buffer, base, 4);
      }
      samples.forEach(function (sample) {
        if (sample.duration !== void 0) {
          base += Writer.writeNumber(sample.duration, buffer, base, 4);
        }
        if (sample.size !== void 0) {
          base += Writer.writeNumber(sample.size, buffer, base, 4);
        }
        if (sample.flags !== void 0) {
          base += Writer.writeNumber(TrackExtendsBox.encodeDefaultSampleFlags(sample.flags), buffer, base, 4);
        }
        if (sample.compositionTimeOffset !== void 0) {
          base += Writer.writeNumber(sample.compositionTimeOffset, buffer, base, 4);
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
      if (f >> 0 & 1) {
        flags.dataOffsetPresent = true;
      }
      if (f >> 2 & 1) {
        flags.firstSampleFlagsPresent = true;
      }
      if (f >> 8 & 1) {
        flags.sampleDurationPresent = true;
      }
      if (f >> 9 & 1) {
        flags.sampleSizePresent = true;
      }
      if (f >> 10 & 1) {
        flags.sampleFlagsPresent = true;
      }
      if (f >> 11 & 1) {
        flags.sampleCompositionTimeOffsetPresent = true;
      }
      return flags;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

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

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      sampleCount = _Reader$readNumber2[1];

      base += readBytesNum;

      samples = new Array(sampleCount);

      flags = TrackRunBox.decodeFlags(props.flags);

      if (flags.dataOffsetPresent) {
        var _Reader$readNumber3 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

        readBytesNum = _Reader$readNumber32[0];
        dataOffset = _Reader$readNumber32[1];

        base += readBytesNum;
        props.dataOffset = dataOffset;
      }

      if (flags.firstSampleFlagsPresent) {
        var _Reader$readNumber4 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

        readBytesNum = _Reader$readNumber42[0];
        firstSampleFlags = _Reader$readNumber42[1];

        base += readBytesNum;
        props.firstSampleFlags = TrackExtendsBox.decodeDefaultSampleFlags(firstSampleFlags);
      }

      for (var i = 0; i < sampleCount; i++) {
        sample = samples[i] = {};

        if (flags.sampleDurationPresent) {
          var _Reader$readNumber5 = Reader.readNumber(buffer, base, 4);

          var _Reader$readNumber52 = _slicedToArray(_Reader$readNumber5, 2);

          readBytesNum = _Reader$readNumber52[0];
          sampleDuration = _Reader$readNumber52[1];

          base += readBytesNum;
          sample.duration = sampleDuration;
        }

        if (flags.sampleSizePresent) {
          var _Reader$readNumber6 = Reader.readNumber(buffer, base, 4);

          var _Reader$readNumber62 = _slicedToArray(_Reader$readNumber6, 2);

          readBytesNum = _Reader$readNumber62[0];
          sampleSize = _Reader$readNumber62[1];

          base += readBytesNum;
          sample.size = sampleSize;
        }

        if (flags.sampleFlagsPresent) {
          var _Reader$readNumber7 = Reader.readNumber(buffer, base, 4);

          var _Reader$readNumber72 = _slicedToArray(_Reader$readNumber7, 2);

          readBytesNum = _Reader$readNumber72[0];
          sampleFlags = _Reader$readNumber72[1];

          base += readBytesNum;
          sample.flags = TrackExtendsBox.decodeDefaultSampleFlags(sampleFlags);
        }

        if (flags.sampleCompositionTimeOffsetPresent) {
          var _Reader$readNumber8 = Reader.readNumber(buffer, base, 4);

          var _Reader$readNumber82 = _slicedToArray(_Reader$readNumber8, 2);

          readBytesNum = _Reader$readNumber82[0];
          sampleCompositionTimeOffset = _Reader$readNumber82[1];

          base += readBytesNum;
          sample.compositionTimeOffset = sampleCompositionTimeOffset;
        }
      }

      props.samples = samples;

      return [base - offset, props];
    }
  }]);

  return TrackRunBox;
})(FullBox);

TrackRunBox.COMPACT_NAME = 'trun';

TrackRunBox.propTypes = {
  samples: PropTypes.arrayOf(PropTypes.object),
  dataOffset: PropTypes.number,
  firstSampleFlags: TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES
};

TrackRunBox.defaultProps = {
  samples: [],
  dataOffset: void 0,
  firstSampleFlags: void 0
};

TrackRunBox.spec = {
  container: 'traf',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = TrackRunBox;