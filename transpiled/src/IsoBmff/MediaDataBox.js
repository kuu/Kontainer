'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Buffer = require('../core/Buffer');

var MediaDataBox = function (_Box) {
  _inherits(MediaDataBox, _Box);

  function MediaDataBox(props) {
    _classCallCheck(this, MediaDataBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MediaDataBox).call(this, MediaDataBox.COMPACT_NAME, props));
  }

  _createClass(MediaDataBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- MediaDataBox.serialize enter.');
      var data = this.props.data,
          base = offset;

      base += _get(Object.getPrototypeOf(MediaDataBox.prototype), 'serialize', this).call(this, buffer, base);

      if (buffer) {
        for (var i = 0, il = data.length; i < il; i++) {
          buffer[base++] = data[i];
        }
      } else {
        base += data.length;
      }

      _get(Object.getPrototypeOf(MediaDataBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- MediaDataBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          toBeRead,
          data,
          buf;

      var _Box$parse = Box.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;
      toBeRead = props.size - readBytesNum;

      buf = new Buffer(toBeRead);
      data = buf.getView();

      for (var i = 0; i < toBeRead; i++) {
        data[i] = buffer[base++];
      }
      props.data = buf.getView();

      return [base - offset, props];
    }
  }]);

  return MediaDataBox;
}(Box);

MediaDataBox.COMPACT_NAME = 'mdat';

MediaDataBox.propTypes = {
  data: PropTypes.any.isRequired
};

MediaDataBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = MediaDataBox;