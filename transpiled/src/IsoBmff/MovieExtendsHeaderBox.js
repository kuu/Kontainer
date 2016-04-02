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

var MovieExtendsHeaderBox = function (_FullBox) {
  _inherits(MovieExtendsHeaderBox, _FullBox);

  function MovieExtendsHeaderBox(props) {
    _classCallCheck(this, MovieExtendsHeaderBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MovieExtendsHeaderBox).call(this, MovieExtendsHeaderBox.COMPACT_NAME, props, props.version, 0));
  }

  _createClass(MovieExtendsHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- MovieExtendsHeaderBox.serialize enter.');
      var props = this.props;
      var byteLength = props.version ? 8 : 4;
      var fragmentDuration = props.fragmentDuration;

      var base = offset;

      base += _get(Object.getPrototypeOf(MovieExtendsHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeNumber(fragmentDuration, buffer, base, byteLength);

      _get(Object.getPrototypeOf(MovieExtendsHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- MovieExtendsHeaderBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          byteLength = undefined,
          fragmentDuration = undefined;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      byteLength = props.version ? 8 : 4;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, byteLength);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      fragmentDuration = _Reader$readNumber2[1];

      base += readBytesNum;

      props.fragmentDuration = fragmentDuration;

      return [base - offset, props];
    }
  }]);

  return MovieExtendsHeaderBox;
}(_FullBox3.default);

exports.default = MovieExtendsHeaderBox;


MovieExtendsHeaderBox.COMPACT_NAME = 'mehd';

MovieExtendsHeaderBox.propTypes = {
  version: _PropTypes2.default.oneOf([0, 1]),
  fragmentDuration: _PropTypes2.default.number.isRequired
};

MovieExtendsHeaderBox.defaultProps = {
  version: 0
};

MovieExtendsHeaderBox.spec = {
  container: 'mvex',
  quantity: _Box2.default.QUANTITY_EXACTLY_ONE, // Actually zero or one.
  mandatoryBoxList: []
};