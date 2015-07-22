'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var HintMediaHeaderBox = (function (_FullBox) {
  _inherits(HintMediaHeaderBox, _FullBox);

  function HintMediaHeaderBox(props) {
    _classCallCheck(this, HintMediaHeaderBox);

    _get(Object.getPrototypeOf(HintMediaHeaderBox.prototype), 'constructor', this).call(this, HintMediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  _createClass(HintMediaHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var props = this.props,
          maxPDUSize = props.maxPDUSize,
          avgPDUSize = props.avgPDUSize,
          maxBitrate = props.maxBitrate,
          avgBitrate = props.avgBitrate,
          base = offset;

      base += _get(Object.getPrototypeOf(HintMediaHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeFixedNumber(maxPDUSize, buffer, base, 2);
      base += Writer.writeFixedNumber(avgPDUSize, buffer, base, 2);
      base += Writer.writeFixedNumber(maxBitrate, buffer, base, 4);
      base += Writer.writeFixedNumber(avgBitrate, buffer, base, 4);
      base += Writer.writeNumber(0, buffer, base, 4);

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
          readBytesNum,
          props,
          maxPDUSize,
          avgPDUSize,
          maxBitrate,
          avgBitrate;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readFixedNumber = Reader.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumber2 = _slicedToArray(_Reader$readFixedNumber, 2);

      readBytesNum = _Reader$readFixedNumber2[0];
      maxPDUSize = _Reader$readFixedNumber2[1];

      base += readBytesNum;

      var _Reader$readFixedNumber3 = Reader.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumber32 = _slicedToArray(_Reader$readFixedNumber3, 2);

      readBytesNum = _Reader$readFixedNumber32[0];
      avgPDUSize = _Reader$readFixedNumber32[1];

      base += readBytesNum;

      var _Reader$readFixedNumber4 = Reader.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumber42 = _slicedToArray(_Reader$readFixedNumber4, 2);

      readBytesNum = _Reader$readFixedNumber42[0];
      maxBitrate = _Reader$readFixedNumber42[1];

      base += readBytesNum;

      var _Reader$readFixedNumber5 = Reader.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumber52 = _slicedToArray(_Reader$readFixedNumber5, 2);

      readBytesNum = _Reader$readFixedNumber52[0];
      avgBitrate = _Reader$readFixedNumber52[1];

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
})(FullBox);

HintMediaHeaderBox.COMPACT_NAME = 'hmhd';

HintMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  maxPDUSize: PropTypes.number.isRequired,
  avgPDUSize: PropTypes.number.isRequired,
  maxBitrate: PropTypes.number.isRequired,
  avgBitrate: PropTypes.number.isRequired
};

HintMediaHeaderBox.defaultProps = {
  version: 0
};

HintMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = HintMediaHeaderBox;