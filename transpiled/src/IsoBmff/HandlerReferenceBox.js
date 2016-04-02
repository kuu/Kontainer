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

var HandlerReferenceBox = function (_FullBox) {
  _inherits(HandlerReferenceBox, _FullBox);

  function HandlerReferenceBox(props) {
    _classCallCheck(this, HandlerReferenceBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HandlerReferenceBox).call(this, HandlerReferenceBox.COMPACT_NAME, props, props.version, 0));
  }

  _createClass(HandlerReferenceBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- HandlerReferenceBox.serialize enter.');
      var props = this.props;
      var handlerType = HandlerReferenceBox.encodeHandlerType(props.handlerType);
      var name = props.name;

      var base = offset;

      base += _get(Object.getPrototypeOf(HandlerReferenceBox.prototype), 'serialize', this).call(this, buffer, base);
      base += _Writer2.default.writeNumber(0, buffer, base, 4);
      base += _Writer2.default.writeString(handlerType, buffer, base, 4);
      base += _Writer2.default.writeNumber(0, buffer, base, 12);
      base += _Writer2.default.writeString(name, buffer, base);

      _get(Object.getPrototypeOf(HandlerReferenceBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- HandlerReferenceBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeHandlerType',
    value: function encodeHandlerType(handlerType) {
      var t = 'vide';
      if (handlerType === 'video') {
        t = 'vide';
      } else if (handlerType === 'audio') {
        t = 'soun';
      } else if (handlerType === 'hint') {
        t = 'hint';
      }
      return t;
    }
  }, {
    key: 'decodeHandlerType',
    value: function decodeHandlerType(t) {
      var handlerType = 'video';
      if (t === 'vide') {
        handlerType = 'video';
      } else if (t === 'soun') {
        handlerType = 'audio';
      } else if (t === 'hint') {
        handlerType = 'hint';
      }
      return handlerType;
    }
  }, {
    key: 'validate',
    value: function validate(context, props) {
      context.currentTrackType = props.handlerType;
      return null;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum = undefined,
          props = undefined,
          handlerType = undefined,
          name = undefined;

      var _FullBox$parse = _FullBox3.default.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readString = _Reader2.default.readString(buffer, base, 4);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      handlerType = _Reader$readString2[1];

      base += readBytesNum;

      base += 12; // skip reserved

      var _Reader$readString3 = _Reader2.default.readString(buffer, base);

      var _Reader$readString4 = _slicedToArray(_Reader$readString3, 2);

      readBytesNum = _Reader$readString4[0];
      name = _Reader$readString4[1];

      base += readBytesNum;

      props.handlerType = HandlerReferenceBox.decodeHandlerType(handlerType);
      props.name = name;

      return [base - offset, props];
    }
  }]);

  return HandlerReferenceBox;
}(_FullBox3.default);

exports.default = HandlerReferenceBox;


HandlerReferenceBox.COMPACT_NAME = 'hdlr';

HandlerReferenceBox.propTypes = {
  version: _PropTypes2.default.oneOf([0, 1]),
  handlerType: _PropTypes2.default.oneOf(['video', 'audio', 'hint']).isRequired,
  name: _PropTypes2.default.string.isRequired
};

HandlerReferenceBox.defaultProps = {
  version: 0
};

HandlerReferenceBox.spec = {
  container: ['mdia', 'meta'],
  quantity: _Box2.default.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};