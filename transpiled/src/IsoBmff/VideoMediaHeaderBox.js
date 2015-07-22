'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var VideoMediaHeaderBox = (function (_FullBox) {
  _inherits(VideoMediaHeaderBox, _FullBox);

  function VideoMediaHeaderBox(props) {
    _classCallCheck(this, VideoMediaHeaderBox);

    _get(Object.getPrototypeOf(VideoMediaHeaderBox.prototype), 'constructor', this).call(this, VideoMediaHeaderBox.COMPACT_NAME, props, props.version, 1);
  }

  _createClass(VideoMediaHeaderBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- VideoMediaHeaderBox.serialize enter.');
      var props = this.props,
          graphicsMode = VideoMediaHeaderBox.encodeGraphicsMode(props.graphicsMode),
          opColor = props.opColor,
          base = offset;

      base += _get(Object.getPrototypeOf(VideoMediaHeaderBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(graphicsMode, buffer, base, 2);
      base += Writer.writeNumber(opColor.r, buffer, base, 2);
      base += Writer.writeNumber(opColor.g, buffer, base, 2);
      base += Writer.writeNumber(opColor.b, buffer, base, 2);

      _get(Object.getPrototypeOf(VideoMediaHeaderBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- VideoMediaHeaderBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'validate',
    value: function validate(context) {
      var trackType = context.currentTrackType;
      if (trackType && trackType !== 'video') {
        return new Error('"' + VideoMediaHeaderBox.COMPACT_NAME + '" box cannot be placed within ' + trackType + ' track.');
      }
      return null;
    }
  }, {
    key: 'encodeGraphicsMode',
    value: function encodeGraphicsMode(mode) {
      var m = 0;
      if (mode === 'copy') {
        m = 0;
      }
      return m;
    }
  }, {
    key: 'decodeGraphicsMode',
    value: function decodeGraphicsMode(m) {
      var mode = 'copy';
      if (m === 0) {
        mode = 'copy';
      }
      return mode;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          graphicsMode,
          r,
          g,
          b;

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      graphicsMode = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      r = _Reader$readNumber32[1];

      base += readBytesNum;

      var _Reader$readNumber4 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

      readBytesNum = _Reader$readNumber42[0];
      g = _Reader$readNumber42[1];

      base += readBytesNum;

      var _Reader$readNumber5 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber52 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber52[0];
      b = _Reader$readNumber52[1];

      base += readBytesNum;

      props.graphicsMode = VideoMediaHeaderBox.decodeGraphicsMode(graphicsMode);
      props.opColor = { r: r, g: g, b: b };

      return [base - offset, props];
    }
  }]);

  return VideoMediaHeaderBox;
})(FullBox);

VideoMediaHeaderBox.COMPACT_NAME = 'vmhd';

VideoMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  graphicsMode: PropTypes.oneOf(['copy']),
  opColor: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number
  })
};

VideoMediaHeaderBox.defaultProps = {
  version: 0,
  graphicsMode: 'copy',
  opColor: { r: 0, g: 0, b: 0 }
};

VideoMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = VideoMediaHeaderBox;