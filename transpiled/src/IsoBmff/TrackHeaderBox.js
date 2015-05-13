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

var TrackHeaderBox = (function (_FullBox) {
  function TrackHeaderBox(props) {
    _classCallCheck(this, TrackHeaderBox);

    _get(Object.getPrototypeOf(TrackHeaderBox.prototype), 'constructor', this).call(this, TrackHeaderBox.COMPACT_NAME, props, props.version, TrackHeaderBox.encodeFlags(props.flags));
  }

  _inherits(TrackHeaderBox, _FullBox);

  _createClass(TrackHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackHeaderBox.serialize enter.');
      var props = this.props,
          version = props.version,
          creationTime = props.creationTime || new Date(),
          modificationTime = props.modificationTime || new Date(),
          trackId = props.trackId | 0,
          duration = props.duration | 0,
          layer = props.layer,
          alternateGroup = props.alternateGroup | 0,
          volume = props.volume,
          matrix = props.matrix,
          width = props.width,
          height = props.height,
          byteLength = version ? 8 : 4,
          base = offset;

      base += _get(Object.getPrototypeOf(TrackHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(FullBox.date2sec(creationTime), buffer, base, byteLength);
      base += Writer.writeNumber(FullBox.date2sec(modificationTime), buffer, base, byteLength);
      base += Writer.writeNumber(trackId, buffer, base, 4);
      base += Writer.writeNumber(0, buffer, base, 4);
      base += Writer.writeNumber(duration, buffer, base, byteLength);
      base += Writer.writeNumber(0, buffer, base, 8);
      base += Writer.writeNumber(layer, buffer, base, 2);
      base += Writer.writeNumber(alternateGroup, buffer, base, 2);
      base += Writer.writeFixedNumber(volume, buffer, base, 2);
      base += Writer.writeNumber(0, buffer, base, 2);
      for (var i = 0; i < 9; i++) {
        base += Writer.writeFixedNumber(matrix[i], buffer, base, 4);
      }
      base += Writer.writeFixedNumber(width, buffer, base, 4);
      base += Writer.writeFixedNumber(height, buffer, base, 4);

      _get(Object.getPrototypeOf(TrackHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TrackHeaderBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeFlags',
    value: function encodeFlags(flags) {
      var f = 0;
      if (flags.enabled) {
        f |= 1;
      }
      if (flags.inMovie) {
        f |= 2;
      }
      if (flags.inPreview) {
        f |= 4;
      }
      return f;
    }
  }, {
    key: 'decodeFlags',
    value: function decodeFlags(f) {
      var flags = {
        enabled: false,
        inMovie: false,
        inPreview: false
      };

      if (f & 1) {
        flags.enabled = true;
      }
      if (f & 2) {
        flags.inMovie = true;
      }
      if (f & 4) {
        flags.inPreview = true;
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
          byteLength,
          creationTime,
          modificationTime,
          trackId,
          duration,
          layer,
          alternateGroup,
          volume,
          matrix = new Array(9),
          width,
          height;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;
      byteLength = props.version ? 8 : 4;

      var _Reader$readNumber = Reader.readNumber(buffer, base, byteLength);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      creationTime = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, byteLength);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      modificationTime = _Reader$readNumber32[1];

      base += readBytesNum;

      var _Reader$readNumber4 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

      readBytesNum = _Reader$readNumber42[0];
      trackId = _Reader$readNumber42[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readNumber5 = Reader.readNumber(buffer, base, byteLength);

      var _Reader$readNumber52 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber52[0];
      duration = _Reader$readNumber52[1];

      base += readBytesNum;

      base += 8; // skip reserved

      var _Reader$readNumber6 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber62 = _slicedToArray(_Reader$readNumber6, 2);

      readBytesNum = _Reader$readNumber62[0];
      layer = _Reader$readNumber62[1];

      base += readBytesNum;

      var _Reader$readNumber7 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber72 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber72[0];
      alternateGroup = _Reader$readNumber72[1];

      base += readBytesNum;

      var _Reader$readFixedNumber = Reader.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumber2 = _slicedToArray(_Reader$readFixedNumber, 2);

      readBytesNum = _Reader$readFixedNumber2[0];
      volume = _Reader$readFixedNumber2[1];

      base += readBytesNum;

      base += 2; // skip reserved

      for (var i = 0; i < 9; i++) {
        var _Reader$readFixedNumber3 = Reader.readFixedNumber(buffer, base, 4);

        var _Reader$readFixedNumber32 = _slicedToArray(_Reader$readFixedNumber3, 2);

        readBytesNum = _Reader$readFixedNumber32[0];
        matrix[i] = _Reader$readFixedNumber32[1];

        base += readBytesNum;
      }

      var _Reader$readFixedNumber4 = Reader.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumber42 = _slicedToArray(_Reader$readFixedNumber4, 2);

      readBytesNum = _Reader$readFixedNumber42[0];
      width = _Reader$readFixedNumber42[1];

      base += readBytesNum;

      var _Reader$readFixedNumber5 = Reader.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumber52 = _slicedToArray(_Reader$readFixedNumber5, 2);

      readBytesNum = _Reader$readFixedNumber52[0];
      height = _Reader$readFixedNumber52[1];

      base += readBytesNum;

      props.flags = TrackHeaderBox.decodeFlags(props.flags);
      props.creationTime = FullBox.sec2date(creationTime);
      props.modificationTime = FullBox.sec2date(modificationTime);
      props.trackId = trackId;
      props.duration = duration;
      props.layer = layer;
      props.alternateGroup = alternateGroup;
      props.volume = volume;
      props.matrix = matrix;
      props.width = width;
      props.height = height;

      return [base - offset, props];
    }
  }]);

  return TrackHeaderBox;
})(FullBox);

TrackHeaderBox.COMPACT_NAME = 'tkhd';

TrackHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  flags: PropTypes.shape({
    enabled: PropTypes.bool,
    inMovie: PropTypes.bool,
    inPreview: PropTypes.bool
  }),
  creationTime: PropTypes.instanceOf(Date),
  modificationTime: PropTypes.instanceOf(Date),
  trackId: PropTypes.number.isRequired,
  duration: PropTypes.number,
  layer: PropTypes.number,
  alternateGroup: PropTypes.number,
  volume: PropTypes.number,
  matrix: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

TrackHeaderBox.defaultProps = {
  version: 0,
  flags: {
    enabled: true,
    inMovie: true,
    inPreview: false
  },
  creationTime: null,
  modificationTime: null,
  duration: 4294967295,
  layer: 0,
  alternateGroup: 0,
  volume: 1,
  matrix: [1, 0, 0, 0, 1, 0, 0, 0, 16384]
};

TrackHeaderBox.spec = {
  container: 'trak',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = TrackHeaderBox;