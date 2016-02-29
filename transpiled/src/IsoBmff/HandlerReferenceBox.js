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
      var props = this.props,
          handlerType = HandlerReferenceBox.encodeHandlerType(props.handlerType),
          name = props.name,
          base = offset;

      base += _get(Object.getPrototypeOf(HandlerReferenceBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(0, buffer, base, 4);
      base += Writer.writeString(handlerType, buffer, base, 4);
      base += Writer.writeNumber(0, buffer, base, 12);
      base += Writer.writeString(name, buffer, base);

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
          readBytesNum,
          props,
          handlerType,
          name;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readString = Reader.readString(buffer, base, 4);

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      handlerType = _Reader$readString2[1];

      base += readBytesNum;

      base += 12; // skip reserved

      var _Reader$readString3 = Reader.readString(buffer, base);

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
}(FullBox);

HandlerReferenceBox.COMPACT_NAME = 'hdlr';

HandlerReferenceBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  handlerType: PropTypes.oneOf(['video', 'audio', 'hint']).isRequired,
  name: PropTypes.string.isRequired
};

HandlerReferenceBox.defaultProps = {
  version: 0
};

HandlerReferenceBox.spec = {
  container: ['mdia', 'meta'],
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = HandlerReferenceBox;