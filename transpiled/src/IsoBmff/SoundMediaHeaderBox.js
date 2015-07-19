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

var SoundMediaHeaderBox = (function (_FullBox) {
  function SoundMediaHeaderBox(props) {
    _classCallCheck(this, SoundMediaHeaderBox);

    _get(Object.getPrototypeOf(SoundMediaHeaderBox.prototype), 'constructor', this).call(this, SoundMediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  _inherits(SoundMediaHeaderBox, _FullBox);

  _createClass(SoundMediaHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var props = this.props,
          balance = props.balance,
          base = offset;

      base += _get(Object.getPrototypeOf(SoundMediaHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeFixedNumber(balance, buffer, base, 2);
      base += Writer.writeNumber(0, buffer, base, 2);

      _get(Object.getPrototypeOf(SoundMediaHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      return this.size;
    }
  }], [{
    key: 'validate',
    value: function validate(context) {
      var trackType = context.currentTrackType;
      if (trackType && trackType !== 'audio') {
        return new Error('"' + SoundMediaHeaderBox.COMPACT_NAME + '" box cannot be placed within ' + trackType + ' track.');
      }
      return null;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          balance;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readFixedNumber = Reader.readFixedNumber(buffer, base, 2);

      var _Reader$readFixedNumber2 = _slicedToArray(_Reader$readFixedNumber, 2);

      readBytesNum = _Reader$readFixedNumber2[0];
      balance = _Reader$readFixedNumber2[1];

      base += readBytesNum;

      base += 2; // skip reserved

      props.balance = balance;

      return [base - offset, props];
    }
  }]);

  return SoundMediaHeaderBox;
})(FullBox);

SoundMediaHeaderBox.COMPACT_NAME = 'smhd';

SoundMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  balance: PropTypes.number
};

SoundMediaHeaderBox.defaultProps = {
  version: 0,
  balance: 0
};

SoundMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = SoundMediaHeaderBox;