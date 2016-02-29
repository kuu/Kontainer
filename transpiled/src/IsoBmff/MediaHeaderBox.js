'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var MediaHeaderBox = function (_FullBox) {
  _inherits(MediaHeaderBox, _FullBox);

  function MediaHeaderBox(props) {
    _classCallCheck(this, MediaHeaderBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MediaHeaderBox).call(this, MediaHeaderBox.COMPACT_NAME, props, props.version, 0));
  }

  _createClass(MediaHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- MediaHeaderBox.serialize enter.');
      var props = this.props,
          version = props.version,
          creationTime = props.creationTime || new Date(),
          modificationTime = props.modificationTime || new Date(),
          timeScale = props.timeScale | 0,
          duration = props.duration | 0,
          language = props.language,
          byteLength = version ? 8 : 4,
          base = offset;

      base += _get(Object.getPrototypeOf(MediaHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(FullBox.date2sec(creationTime), buffer, base, byteLength);
      base += Writer.writeNumber(FullBox.date2sec(modificationTime), buffer, base, byteLength);
      base += Writer.writeNumber(timeScale, buffer, base, 4);
      base += Writer.writeNumber(duration, buffer, base, byteLength);
      base += Writer.writeIso639Lang(language, buffer, base);
      base += Writer.writeNumber(0, buffer, base, 2);

      _get(Object.getPrototypeOf(MediaHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- MediaHeaderBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          byteLength,
          creationTime,
          modificationTime,
          timeScale,
          duration,
          language;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;
      byteLength = props.version ? 8 : 4;

      var _Reader$readNumber = Reader.readNumber(buffer, base, byteLength);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      creationTime = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, byteLength);

      var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber4[0];
      modificationTime = _Reader$readNumber4[1];

      base += readBytesNum;

      var _Reader$readNumber5 = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber6[0];
      timeScale = _Reader$readNumber6[1];

      base += readBytesNum;

      var _Reader$readNumber7 = Reader.readNumber(buffer, base, byteLength);

      var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber8[0];
      duration = _Reader$readNumber8[1];

      base += readBytesNum;

      var _Reader$readIso639Lan = Reader.readIso639Lang(buffer, base);

      var _Reader$readIso639Lan2 = _slicedToArray(_Reader$readIso639Lan, 2);

      readBytesNum = _Reader$readIso639Lan2[0];
      language = _Reader$readIso639Lan2[1];

      base += readBytesNum;

      base += 2; // skip reserved

      props.creationTime = FullBox.sec2date(creationTime);
      props.modificationTime = FullBox.sec2date(modificationTime);
      props.timeScale = timeScale;
      props.duration = duration;
      props.language = language;

      return [base - offset, props];
    }
  }]);

  return MediaHeaderBox;
}(FullBox);

MediaHeaderBox.COMPACT_NAME = 'mdhd';

MediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  creationTime: PropTypes.instanceOf(Date),
  modificationTime: PropTypes.instanceOf(Date),
  timeScale: PropTypes.number.isRequired,
  duration: PropTypes.number,
  language: PropTypes.string
};

MediaHeaderBox.defaultProps = {
  version: 0,
  creationTime: null,
  modificationTime: null,
  duration: 0xFFFFFFFF,
  language: 'eng'
};

MediaHeaderBox.spec = {
  container: 'mdia',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = MediaHeaderBox;