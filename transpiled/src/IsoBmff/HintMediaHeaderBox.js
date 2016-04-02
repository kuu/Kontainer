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

var HintMediaHeaderBox = function (_FullBox) {
  _inherits(HintMediaHeaderBox, _FullBox);

  function HintMediaHeaderBox(props) {
    _classCallCheck(this, HintMediaHeaderBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HintMediaHeaderBox).call(this, HintMediaHeaderBox.COMPACT_NAME, props, props.version, 0));
  }

  _createClass(HintMediaHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var props = this.props;
      var maxPDUSize = props.maxPDUSize;
      var avgPDUSize = props.avgPDUSize;
      var maxBitrate = props.maxBitrate;
      var avgBitrate = props.avgBitrate;

      var base = offset;

      base += _get(Object.getPrototypeOf(HintMediaHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeFixedNumber(maxPDUSize, buffer, base, 2);
      base += _Writer2.default.writeFixedNumber(avgPDUSize, buffer, base, 2);
      base += _Writer2.default.writeFixedNumber(maxBitrate, buffer, base, 4);
      base += _Writer2.default.writeFixedNumber(avgBitrate, buffer, base, 4);
      base += _Writer2.default.writeNumber(0, buffer, base, 4);

      _get(Object.getPrototypeOf(HintMediaHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      return this.size;
    }
  }], [{
    key: 'validate',
    value: function validate(context) {
      var trackType = context.currentTrackType;
      if (trackType && trackType !== 'hint') {
        return new Error('"' + HintMediaHeaderBox.COMPACT_NAME + '" box cannot be placed within ' + trackType + ' track.');
      }
      return null;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          maxPDUSize = undefined,
          avgPDUSize = undefined,
          maxBitrate = undefined,
          avgBitrate = undefined;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readFixedNumb = _Reader2.default.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumb2 = _slicedToArray(_Reader$readFixedNumb, 2);

      readBytesNum = _Reader$readFixedNumb2[0];
      maxPDUSize = _Reader$readFixedNumb2[1];

      base += readBytesNum;

      var _Reader$readFixedNumb3 = _Reader2.default.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumb4 = _slicedToArray(_Reader$readFixedNumb3, 2);

      readBytesNum = _Reader$readFixedNumb4[0];
      avgPDUSize = _Reader$readFixedNumb4[1];

      base += readBytesNum;

      var _Reader$readFixedNumb5 = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb6 = _slicedToArray(_Reader$readFixedNumb5, 2);

      readBytesNum = _Reader$readFixedNumb6[0];
      maxBitrate = _Reader$readFixedNumb6[1];

      base += readBytesNum;

      var _Reader$readFixedNumb7 = _Reader2.default.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumb8 = _slicedToArray(_Reader$readFixedNumb7, 2);

      readBytesNum = _Reader$readFixedNumb8[0];
      avgBitrate = _Reader$readFixedNumb8[1];

      base += readBytesNum;

      base += 4; // skip reserved

      props.maxPDUSize = maxPDUSize;
      props.avgPDUSize = avgPDUSize;
      props.maxBitrate = maxBitrate;
      props.avgBitrate = avgBitrate;

      return [base - offset, props];
    }
  }]);

  return HintMediaHeaderBox;
}(_FullBox3.default);

exports.default = HintMediaHeaderBox;


HintMediaHeaderBox.COMPACT_NAME = 'hmhd';

HintMediaHeaderBox.propTypes = {
  version: _PropTypes2.default.oneOf([0, 1]),
  maxPDUSize: _PropTypes2.default.number.isRequired,
  avgPDUSize: _PropTypes2.default.number.isRequired,
  maxBitrate: _PropTypes2.default.number.isRequired,
  avgBitrate: _PropTypes2.default.number.isRequired
};

HintMediaHeaderBox.defaultProps = {
  version: 0
};

HintMediaHeaderBox.spec = {
  container: 'minf',
  quantity: _Box2.default.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};