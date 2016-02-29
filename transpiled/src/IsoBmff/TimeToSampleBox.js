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

var TimeToSampleBox = function (_FullBox) {
  _inherits(TimeToSampleBox, _FullBox);

  function TimeToSampleBox(props) {
    _classCallCheck(this, TimeToSampleBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TimeToSampleBox).call(this, TimeToSampleBox.COMPACT_NAME, props, props.version, 0));
  }

  _createClass(TimeToSampleBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- TimeToSampleBox.serialize enter.');
      var props = this.props,
          entries = props.entries,
          entryCount = entries.length,
          base = offset;

      base += _get(Object.getPrototypeOf(TimeToSampleBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(entryCount, buffer, base, 4);

      for (var i = 0; i < entryCount; i++) {
        base += Writer.writeNumber(entries[i].sampleCount, buffer, base, 4);
        base += Writer.writeNumber(entries[i].sampleDelta, buffer, base, 4);
      }

      _get(Object.getPrototypeOf(TimeToSampleBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- TimeToSampleBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          entryCount,
          sampleCount,
          sampleDelta,
          entries = [];

      var _FullBox$parse = FullBox.parse(buffer, base);

      var _FullBox$parse2 = _slicedToArray(_FullBox$parse, 2);

      readBytesNum = _FullBox$parse2[0];
      props = _FullBox$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 4);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      entryCount = _Reader$readNumber2[1];

      base += readBytesNum;

      for (var i = 0; i < entryCount; i++) {
        var _Reader$readNumber3 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

        readBytesNum = _Reader$readNumber4[0];
        sampleCount = _Reader$readNumber4[1];

        base += readBytesNum;

        var _Reader$readNumber5 = Reader.readNumber(buffer, base, 4);

        var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

        readBytesNum = _Reader$readNumber6[0];
        sampleDelta = _Reader$readNumber6[1];

        base += readBytesNum;

        entries.push({
          sampleCount: sampleCount,
          sampleDelta: sampleDelta
        });
      }

      props.entries = entries;

      return [base - offset, props];
    }
  }]);

  return TimeToSampleBox;
}(FullBox);

TimeToSampleBox.COMPACT_NAME = 'stts';

TimeToSampleBox.propTypes = {
  version: PropTypes.number,
  entries: PropTypes.arrayOf(PropTypes.shape({
    sampleCount: PropTypes.number,
    sampleDelta: PropTypes.number
  })).isRequired
};

TimeToSampleBox.defaultProps = {
  version: 0
};

TimeToSampleBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = TimeToSampleBox;