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

var DataReferenceBox = function (_FullBox) {
  _inherits(DataReferenceBox, _FullBox);

  function DataReferenceBox(props) {
    _classCallCheck(this, DataReferenceBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataReferenceBox).call(this, DataReferenceBox.COMPACT_NAME, props, props.version, 0));
  }

  _createClass(DataReferenceBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- DataReferenceBox.serialize enter.');
      var props = this.props,
          entryCount = props.entryCount,
          base = offset;

      base += _get(Object.getPrototypeOf(DataReferenceBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeNumber(entryCount, buffer, base, 4);

      _get(Object.getPrototypeOf(DataReferenceBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- DataReferenceBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeFlags',
    value: function encodeFlags(flags) {
      var f = 0;
      if (flags && flags.inTheSameFile) {
        f |= 0x01;
      }
      return f;
    }
  }, {
    key: 'decodeFlags',
    value: function decodeFlags(f) {
      var flags = {
        inTheSameFile: false
      };

      if (f & 0x01) {
        flags.inTheSameFile = true;
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
          entryCount;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      entryCount = _Reader$readNumber2[1];

      base += readBytesNum;

      props.entryCount = entryCount;

      return [base - offset, props];
    }
  }]);

  return DataReferenceBox;
}(_FullBox3.default);

exports.default = DataReferenceBox;


DataReferenceBox.COMPACT_NAME = 'dref';

DataReferenceBox.propTypes = {
  version: _PropTypes2.default.number,
  entryCount: _PropTypes2.default.number.isRequired
};

DataReferenceBox.defaultProps = {
  version: 0
};

DataReferenceBox.spec = {
  container: 'dinf',
  quantity: _Box2.default.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};