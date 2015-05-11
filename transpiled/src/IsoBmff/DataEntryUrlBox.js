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
    DataReferenceBox = require('./DataReferenceBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var DataEntryUrlBox = (function (_FullBox) {
  function DataEntryUrlBox(props) {
    _classCallCheck(this, DataEntryUrlBox);

    _get(Object.getPrototypeOf(DataEntryUrlBox.prototype), 'constructor', this).call(this, DataEntryUrlBox.COMPACT_NAME, props, props.version, DataReferenceBox.encodeFlags(props.flags));
  }

  _inherits(DataEntryUrlBox, _FullBox);

  _createClass(DataEntryUrlBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- DataEntryUrlBox.serialize enter.');
      var props = this.props,
          location = props.location,
          base = offset;

      base += _get(Object.getPrototypeOf(DataEntryUrlBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeString(location, buffer, base);

      _get(Object.getPrototypeOf(DataEntryUrlBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- DataEntryUrlBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          location;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readString = Reader.readString(buffer, base);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      location = _Reader$readString2[1];

      base += readBytesNum;

      props.flags = DataReferenceBox.decodeFlags(props.flag);
      props.location = location;

      return [base - offset, props];
    }
  }]);

  return DataEntryUrlBox;
})(FullBox);

DataEntryUrlBox.COMPACT_NAME = 'url ';

DataEntryUrlBox.propTypes = {
  version: PropTypes.number,
  flags: PropTypes.object,
  location: PropTypes.string.isRequired
};

DataEntryUrlBox.defaultProps = {
  version: 0,
  flags: { inTheSameFile: false }
};

DataEntryUrlBox.spec = {
  container: 'dref',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = DataEntryUrlBox;