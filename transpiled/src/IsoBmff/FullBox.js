'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var FullBox = (function (_Box) {
  function FullBox(type, props, version, flags) {
    _classCallCheck(this, FullBox);

    _get(Object.getPrototypeOf(FullBox.prototype), 'constructor', this).call(this, type, props);
    this.version = version;
    this.flags = flags;
  }

  _inherits(FullBox, _Box);

  _createClass(FullBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- FullBox.serialize enter.');
      var version = this.version,
          flags = this.flags,
          base = offset;

      base += _get(Object.getPrototypeOf(FullBox.prototype), 'serialize', this).call(this, buffer, base);

      // version is unsigned int(8)
      if (version > 255) {
        console.warn('IsoBmff.FullBox.serialize: the version does not fit within unsigned int (8).');
      }

      base += Writer.writeNumber(version, buffer, base, 1);

      // flags is bit(24)
      if (flags >>> 24) {
        console.warn('IsoBmff.FullBox.serialize: the flags does not fit within bit(24).');
      }

      base += Writer.writeNumber(flags, buffer, base, 3);

      _get(Object.getPrototypeOf(FullBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log('--- FullBox.serialize exit.');
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          version,
          flags;

      var _Box$parse = Box.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      version = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, 3);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      flags = _Reader$readNumber32[1];

      base += readBytesNum;

      props.version = version;
      props.flags = flags;

      return [base - offset, props];
    }
  }, {
    key: 'date2sec',
    value: function date2sec(date) {
      var SECONDS_BTW_1904_1970 = 2082844800;
      return (date.getTime() / 1000 | 0) + SECONDS_BTW_1904_1970;
    }
  }, {
    key: 'sec2date',
    value: function sec2date(sec) {
      var SECONDS_BTW_1904_1970 = 2082844800;
      return new Date(Math.max(0, sec - SECONDS_BTW_1904_1970) * 1000);
    }
  }]);

  return FullBox;
})(Box);

module.exports = FullBox;