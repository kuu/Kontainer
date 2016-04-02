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

var TrackHeaderBox = function (_FullBox) {
  _inherits(TrackHeaderBox, _FullBox);

  function TrackHeaderBox(props) {
    _classCallCheck(this, TrackHeaderBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TrackHeaderBox).call(this, TrackHeaderBox.COMPACT_NAME, props, props.version, TrackHeaderBox.encodeFlags(props.flags)));
  }

  _createClass(TrackHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TrackHeaderBox.serialize enter.');
      var props = this.props;
      var version = props.version;
      var creationTime = props.creationTime || new Date();
      var modificationTime = props.modificationTime || new Date();
      var trackId = props.trackId | 0;
      var duration = props.duration | 0;
      var layer = props.layer;
      var alternateGroup = props.alternateGroup | 0;
      var volume = props.volume;
      var matrix = props.matrix;
      var width = props.width;
      var height = props.height;
      var byteLength = version ? 8 : 4;

      var base = offset;

      base += _get(Object.getPrototypeOf(TrackHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeNumber(_FullBox3.default.date2sec(creationTime), buffer, base, byteLength);
      base += _Writer2.default.writeNumber(_FullBox3.default.date2sec(modificationTime), buffer, base, byteLength);
      base += _Writer2.default.writeNumber(trackId, buffer, base, 4);
      base += _Writer2.default.writeNumber(0, buffer, base, 4);
      base += _Writer2.default.writeNumber(duration, buffer, base, byteLength);
      base += _Writer2.default.writeNumber(0, buffer, base, 8);
      base += _Writer2.default.writeNumber(layer, buffer, base, 2);
      base += _Writer2.default.writeNumber(alternateGroup, buffer, base, 2);
      base += _Writer2.default.writeFixedNumber(volume, buffer, base, 2);
      base += _Writer2.default.writeNumber(0, buffer, base, 2);
      for (var i = 0; i < 9; i++) {
        base += _Writer2.default.writeFixedNumber(matrix[i], buffer, base, 4);
      }
      base += _Writer2.default.writeFixedNumber(width, buffer, base, 4);
      base += _Writer2.default.writeFixedNumber(height, buffer, base, 4);

      _get(Object.getPrototypeOf(TrackHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TrackHeaderBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeFlags',
    value: function encodeFlags(flags) {
      var f = 0;
      if (flags.enabled) {
        f |= 0x01;
      }
      if (flags.inMovie) {
        f |= 0x02;
      }
      if (flags.inPreview) {
        f |= 0x04;
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

      if (f & 0x01) {
        flags.enabled = true;
      }
      if (f & 0x02) {
        flags.inMovie = true;
      }
      if (f & 0x04) {
        flags.inPreview = true;
      }
      return flags;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          byteLength = undefined,
          creationTime = undefined,
          modificationTime = undefined,
          trackId = undefined,
          duration = undefined,
          layer = undefined,
          alternateGroup = undefined,
          volume = undefined,
          matrix = new Array(9),
          width = undefined,
          height = undefined;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;
      byteLength = props.version ? 8 : 4;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, byteLength);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      creationTime = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = _Reader2.default.readNumber(buffer, base, byteLength);

      var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber4[0];
      modificationTime = _Reader$readNumber4[1];

      base += readBytesNum;

      var _Reader$readNumber5 = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber6[0];
      trackId = _Reader$readNumber6[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readNumber7 = _Reader2.default.readNumber(buffer, base, byteLength);

      var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber8[0];
      duration = _Reader$readNumber8[1];

      base += readBytesNum;

      base += 8; // skip reserved

      var _Reader$readNumber9 = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber10 = _slicedToArray(_Reader$readNumber9, 2);

      readBytesNum = _Reader$readNumber10[0];
      layer = _Reader$readNumber10[1];

      base += readBytesNum;

      var _Reader$readNumber11 = _Reader2.default.readNumber(buffer, base, 2);

      var _Reader$readNumber12 = _slicedToArray(_Reader$readNumber11, 2);

      readBytesNum = _Reader$readNumber12[0];
      alternateGroup = _Reader$readNumber12[1];

      base += readBytesNum;

      var _Reader$readFixedNumb = _Reader2.default.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumb2 = _slicedToArray(_Reader$readFixedNumb, 2);

      readBytesNum = _Reader$readFixedNumb2[0];
      volume = _Reader$readFixedNumb2[1];

      base += readBytesNum;

      base += 2; // skip reserved

      for (var i = 0; i < 9; i++) {
        var _Reader$readFixedNumb3 = _Reader2.default.readFixedNumber(buffer, base, 4);

        var _Reader$readFixedNumb4 = _slicedToArray(_Reader$readFixedNumb3, 2);

        readBytesNum = _Reader$readFixedNumb4[0];
        matrix[i] = _Reader$readFixedNumb4[1];

        base += readBytesNum;
      }

      var _Reader$readFixedNumb5 = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb6 = _slicedToArray(_Reader$readFixedNumb5, 2);

      readBytesNum = _Reader$readFixedNumb6[0];
      width = _Reader$readFixedNumb6[1];

      base += readBytesNum;

      var _Reader$readFixedNumb7 = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb8 = _slicedToArray(_Reader$readFixedNumb7, 2);

      readBytesNum = _Reader$readFixedNumb8[0];
      height = _Reader$readFixedNumb8[1];

      base += readBytesNum;

      props.flags = TrackHeaderBox.decodeFlags(props.flags);
      props.creationTime = _FullBox3.default.sec2date(creationTime);
      props.modificationTime = _FullBox3.default.sec2date(modificationTime);
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
}(_FullBox3.default);

exports.default = TrackHeaderBox;


TrackHeaderBox.COMPACT_NAME = 'tkhd';

TrackHeaderBox.propTypes = {
  version: _PropTypes2.default.oneOf([0, 1]),
  flags: _PropTypes2.default.shape({
    enabled: _PropTypes2.default.bool,
    inMovie: _PropTypes2.default.bool,
    inPreview: _PropTypes2.default.bool
  }),
  creationTime: _PropTypes2.default.instanceOf(Date),
  modificationTime: _PropTypes2.default.instanceOf(Date),
  trackId: _PropTypes2.default.number.isRequired,
  duration: _PropTypes2.default.number,
  layer: _PropTypes2.default.number,
  alternateGroup: _PropTypes2.default.number,
  volume: _PropTypes2.default.number,
  matrix: _PropTypes2.default.arrayOf(_PropTypes2.default.number),
  width: _PropTypes2.default.number.isRequired,
  height: _PropTypes2.default.number.isRequired
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
  duration: 0xFFFFFFFF,
  layer: 0,
  alternateGroup: 0,
  volume: 1.0,
  matrix: [1, 0, 0, 0, 1, 0, 0, 0, 16384]
};

TrackHeaderBox.spec = {
  container: 'trak',
  quantity: _Box2.default.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};