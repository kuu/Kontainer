'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var FileTypeBox = (function (_Box) {
  function FileTypeBox(props) {
    _classCallCheck(this, FileTypeBox);

    _get(Object.getPrototypeOf(FileTypeBox.prototype), 'constructor', this).call(this, FileTypeBox.COMPACT_NAME, props);
  }

  _inherits(FileTypeBox, _Box);

  _createClass(FileTypeBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- FileTypeBox.serialize enter.');
      var majorBrand = this.props.majorBrand,
          minorVersion = this.props.minorVersion,
          compatibleBrands = this.props.compatibleBrands,
          base = offset;

      base += _get(Object.getPrototypeOf(FileTypeBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeString(majorBrand, buffer, base, 4);
      base += Writer.writeNumber(minorVersion, buffer, base, 4);
      compatibleBrands.forEach(function (brand) {
        base += Writer.writeString(brand, buffer, base, 4);
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
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          boxEnd,
          majorBrand,
          minorVersion,
          brand,
          compatibleBrands;

      var _Box$parse = Box.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;
      boxEnd = offset + props.size;

      var _Reader$readString = Reader.readString(buffer, base, 4);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      majorBrand = _Reader$readString2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      minorVersion = _Reader$readNumber2[1];

      base += readBytesNum;

      props.majorBrand = majorBrand;
      props.minorVersion = minorVersion;
      compatibleBrands = props.compatibleBrands = [];
      while (base < boxEnd) {
        var _Reader$readString3 = Reader.readString(buffer, base, 4);

        var _Reader$readString32 = _slicedToArray(_Reader$readString3, 2);

        readBytesNum = _Reader$readString32[0];
        brand = _Reader$readString32[1];

        compatibleBrands.push(brand);
        base += readBytesNum;
      }

      return [base - offset, props];
    }
  }]);

  return FileTypeBox;
})(Box);

FileTypeBox.COMPACT_NAME = 'ftyp';

FileTypeBox.propTypes = {
  majorBrand: PropTypes.string.isRequired,
  minorVersion: PropTypes.number,
  compatibleBrands: PropTypes.arrayOf(PropTypes.string)
};

FileTypeBox.defaultProps = {
  minorVersion: 0,
  compatibleBrands: []
};

FileTypeBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = FileTypeBox;