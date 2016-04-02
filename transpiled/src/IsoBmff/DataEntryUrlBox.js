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

var _DataReferenceBox = require('./DataReferenceBox');

var _DataReferenceBox2 = _interopRequireDefault(_DataReferenceBox);

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

var DataEntryUrlBox = function (_FullBox) {
  _inherits(DataEntryUrlBox, _FullBox);

  function DataEntryUrlBox(props) {
    _classCallCheck(this, DataEntryUrlBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataEntryUrlBox).call(this, DataEntryUrlBox.COMPACT_NAME, props, props.version, _DataReferenceBox2.default.encodeFlags(props.flags)));
  }

  _createClass(DataEntryUrlBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- DataEntryUrlBox.serialize enter.');
      var props = this.props;
      var location = props.location;

      var base = offset;

      base += _get(Object.getPrototypeOf(DataEntryUrlBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeString(location, buffer, base);

      _get(Object.getPrototypeOf(DataEntryUrlBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- DataEntryUrlBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          location = undefined;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readString = _Reader2.default.readString(buffer, base);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      location = _Reader$readString2[1];

      base += readBytesNum;

      props.flags = _DataReferenceBox2.default.decodeFlags(props.flag);
      props.location = location;

      return [base - offset, props];
    }
  }]);

  return DataEntryUrlBox;
}(_FullBox3.default);

exports.default = DataEntryUrlBox;


DataEntryUrlBox.COMPACT_NAME = 'url ';

DataEntryUrlBox.propTypes = {
  version: _PropTypes2.default.number,
  flags: _PropTypes2.default.object,
  location: _PropTypes2.default.string.isRequired
};

DataEntryUrlBox.defaultProps = {
  version: 0,
  flags: { inTheSameFile: false }
};

DataEntryUrlBox.spec = {
  container: 'dref',
  quantity: _Box2.default.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};