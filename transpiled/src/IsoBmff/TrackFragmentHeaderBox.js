'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box'),
    FullBox = require('./FullBox'),
    TrackExtendsBox = require('./TrackExtendsBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var TrackFragmentHeaderBox = function (_FullBox) {
  _inherits(TrackFragmentHeaderBox, _FullBox);

  function TrackFragmentHeaderBox(props) {
    _classCallCheck(this, TrackFragmentHeaderBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TrackFragmentHeaderBox).call(this, TrackFragmentHeaderBox.COMPACT_NAME, props, 0, TrackFragmentHeaderBox.encodeFlags(props)));
  }

  _createClass(TrackFragmentHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackFragmentHeaderBox.serialize enter.');
      var props = this.props,
          trackId = props.trackId,
          baseDataOffset = props.baseDataOffset,
          sampleDescriptionIndex = props.sampleDescriptionIndex,
          defaultSampleDuration = props.defaultSampleDuration,
          defaultSampleSize = props.defaultSampleSize,
          defaultSampleFlags = TrackExtendsBox.encodeDefaultSampleFlags(props.defaultSampleFlags),
          base = offset;

      base += _get(Object.getPrototypeOf(TrackFragmentHeaderBox.prototype), 'serialize', this).call(this, buffer, base);

      base += Writer.writeNumber(trackId, buffer, base, 4);

      if (baseDataOffset !== void 0) {
        base += Writer.writeNumber(baseDataOffset, buffer, base, 8);
      }
      if (sampleDescriptionIndex !== void 0) {
        base += Writer.writeNumber(sampleDescriptionIndex, buffer, base, 4);
      }
      if (defaultSampleDuration !== void 0) {
        base += Writer.writeNumber(defaultSampleDuration, buffer, base, 4);
      }
      if (defaultSampleSize !== void 0) {
        base += Writer.writeNumber(defaultSampleSize, buffer, base, 4);
      }
      if (defaultSampleFlags !== void 0) {
        base += Writer.writeNumber(defaultSampleFlags, buffer, base, 4);
      }

      _get(Object.getPrototypeOf(TrackFragmentHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TrackFragmentHeaderBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeFlags',
    value: function encodeFlags(props) {
      var f = 0;
      if (props.baseDataOffset !== void 0) {
        f |= 1 << 0;
      }
      if (props.sampleDescriptionIndex !== void 0) {
        f |= 1 << 1;
      }
      if (props.defaultSampleDuration !== void 0) {
        f |= 1 << 3;
      }
      if (props.defaultSampleSize !== void 0) {
        f |= 1 << 4;
      }
      if (props.defaultSampleFlags !== void 0) {
        f |= 1 << 5;
      }
      if (props.durationIsEmpty) {
        f |= 1 << 16;
      }
      return f;
    }
  }, {
    key: 'decodeFlags',
    value: function decodeFlags(f) {
      var flags = {
        baseDataOffsetPresent: false,
        sampleDescriptionIndexPresent: false,
        defaultSampleDurationPresent: false,
        defaultSampleSizePresent: false,
        defaultSampleFlagsPresent: false,
        durationIsEmpty: false
      };
      if (f >> 0 & 0x01) {
        flags.baseDataOffsetPresent = true;
      }
      if (f >> 1 & 0x01) {
        flags.sampleDescriptionIndexPresent = true;
      }
      if (f >> 3 & 0x01) {
        flags.defaultSampleDurationPresent = true;
      }
      if (f >> 4 & 0x01) {
        flags.defaultSampleSizePresent = true;
      }
      if (f >> 5 & 0x01) {
        flags.defaultSampleFlagsPresent = true;
      }
      if (f >> 16 & 0x01) {
        flags.durationIsEmpty = true;
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
          trackId,
          baseDataOffset,
          sampleDescriptionIndex,
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
      props.trackId = trackId;

      flags = TrackFragmentHeaderBox.decodeFlags(props.flags);

      if (flags.baseDataOffsetPresent) {
        var _Reader$readNumber3 = Reader.readNumber(buffer, base, 8);

        var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

        readBytesNum = _Reader$readNumber4[0];
        baseDataOffset = _Reader$readNumber4[1];

        base += readBytesNum;
        props.baseDataOffset = baseDataOffset;
      }

      if (flags.sampleDescriptionIndexPresent) {
        var _Reader$readNumber5 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

        readBytesNum = _Reader$readNumber6[0];
        sampleDescriptionIndex = _Reader$readNumber6[1];

        base += readBytesNum;
        props.sampleDescriptionIndex = sampleDescriptionIndex;
      }

      if (flags.defaultSampleDurationPresent) {
        var _Reader$readNumber7 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

        readBytesNum = _Reader$readNumber8[0];
        defaultSampleDuration = _Reader$readNumber8[1];

        base += readBytesNum;
        props.defaultSampleDuration = defaultSampleDuration;
      }

      if (flags.defaultSampleSizePresent) {
        var _Reader$readNumber9 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber10 = _slicedToArray(_Reader$readNumber9, 2);

        readBytesNum = _Reader$readNumber10[0];
        defaultSampleSize = _Reader$readNumber10[1];

        base += readBytesNum;
        props.defaultSampleSize = defaultSampleSize;
      }

      if (flags.defaultSampleFlagsPresent) {
        var _Reader$readNumber11 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber12 = _slicedToArray(_Reader$readNumber11, 2);

        readBytesNum = _Reader$readNumber12[0];
        defaultSampleFlags = _Reader$readNumber12[1];

        base += readBytesNum;
        props.defaultSampleFlags = TrackExtendsBox.decodeDefaultSampleFlags(defaultSampleFlags);
      }

      props.durationIsEmpty = flags.durationIsEmpty;

      return [base - offset, props];
    }
  }]);

  return TrackFragmentHeaderBox;
}(FullBox);

TrackFragmentHeaderBox.COMPACT_NAME = 'tfhd';

TrackFragmentHeaderBox.propTypes = {
  trackId: PropTypes.number.isRequired,
  baseDataOffset: PropTypes.number,
  sampleDescriptionIndex: PropTypes.number,
  defaultSampleDuration: PropTypes.number,
  defaultSampleSize: PropTypes.number,
  defaultSampleFlags: TrackExtendsBox.DEFAULT_SAMPLE_FLAGS_PROPTYPES,
  durationIsEmpty: PropTypes.bool
};

TrackExtendsBox.defaultProps = {
  baseDataOffset: void 0,
  sampleDescriptionIndex: void 0,
  defaultSampleDuration: void 0,
  defaultSampleSize: void 0,
  defaultSampleFlags: void 0,
  durationIsEmpty: false
};

TrackFragmentHeaderBox.spec = {
  container: 'traf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = TrackFragmentHeaderBox;