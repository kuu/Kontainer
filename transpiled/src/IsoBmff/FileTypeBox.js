'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Box2 = require('./Box');

var _Box3 = _interopRequireDefault(_Box2);

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

var FileTypeBox = function (_Box) {
  _inherits(FileTypeBox, _Box);

  function FileTypeBox(props) {
    _classCallCheck(this, FileTypeBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FileTypeBox).call(this, FileTypeBox.COMPACT_NAME, props));
  }

  _createClass(FileTypeBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- FileTypeBox.serialize enter.');
      var majorBrand = this.props.majorBrand;
      var minorVersion = this.props.minorVersion;
      var compatibleBrands = this.props.compatibleBrands;

      var base = offset;

      base += _get(Object.getPrototypeOf(FileTypeBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeString(majorBrand, buffer, base, 4);
      base += _Writer2.default.writeNumber(minorVersion, buffer, base, 4);
      compatibleBrands.forEach(function (brand) {
        base += _Writer2.default.writeString(brand, buffer, base, 4);
      });

      _get(Object.getPrototypeOf(FileTypeBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- FileTypeBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'validate',
    value: function validate(context, props) {
      context.majorBrand = props.majorBrand;
      context.minorVersion = props.minorVersion;
      context.compatibleBrands = props.compatibleBrands;
      return null;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          boxEnd = undefined,
          majorBrand = undefined,
          minorVersion = undefined,
          brand = undefined,
          compatibleBrands = undefined;

      var _Box$parse = _Box3.default.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;
      boxEnd = offset + props.size;

      var _Reader$readString = _Reader2.default.readString(buffer, base, 4);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      majorBrand = _Reader$readString2[1];

      base += readBytesNum;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      minorVersion = _Reader$readNumber2[1];

      base += readBytesNum;

      props.majorBrand = majorBrand;
      props.minorVersion = minorVersion;
      compatibleBrands = props.compatibleBrands = [];
      while (base < boxEnd) {
        var _Reader$readString3 = _Reader2.default.readString(buffer, base, 4);

        var _Reader$readString4 = _slicedToArray(_Reader$readString3, 2);

        readBytesNum = _Reader$readString4[0];
        brand = _Reader$readString4[1];

        compatibleBrands.push(brand);
        base += readBytesNum;
      }

      return [base - offset, props];
    }
  }]);

  return FileTypeBox;
}(_Box3.default);

exports.default = FileTypeBox;


FileTypeBox.COMPACT_NAME = 'ftyp';

FileTypeBox.propTypes = {
  majorBrand: _PropTypes2.default.string.isRequired,
  minorVersion: _PropTypes2.default.number,
  compatibleBrands: _PropTypes2.default.arrayOf(_PropTypes2.default.string)
};

FileTypeBox.defaultProps = {
  minorVersion: 0,
  compatibleBrands: []
};

FileTypeBox.spec = {
  container: 'file',
  quantity: _Box3.default.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};