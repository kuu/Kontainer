'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    AudioSampleEntry = require('./AudioSampleEntry'),
    PropTypes = require('../core/PropTypes');

var MP4AudioSampleEntry = (function (_AudioSampleEntry) {
  _inherits(MP4AudioSampleEntry, _AudioSampleEntry);

  function MP4AudioSampleEntry(props) {
    _classCallCheck(this, MP4AudioSampleEntry);

    _get(Object.getPrototypeOf(MP4AudioSampleEntry.prototype), 'constructor', this).call(this, MP4AudioSampleEntry.COMPACT_NAME, props);
  }

  _createClass(MP4AudioSampleEntry, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- MP4AudioSampleEntry.serialize enter.');
      var base = offset;

      base += _get(Object.getPrototypeOf(MP4AudioSampleEntry.prototype), 'serialize', this).call(this, buffer, base);
      _get(Object.getPrototypeOf(MP4AudioSampleEntry.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- MP4AudioSampleEntry.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props;

      var _AudioSampleEntry$parse = AudioSampleEntry.parse(buffer, base);

      var _AudioSampleEntry$parse2 = _slicedToArray(_AudioSampleEntry$parse, 2);

      readBytesNum = _AudioSampleEntry$parse2[0];
      props = _AudioSampleEntry$parse2[1];

      base += readBytesNum;

      return [base - offset, props];
    }
  }]);

  return MP4AudioSampleEntry;
})(AudioSampleEntry);

MP4AudioSampleEntry.COMPACT_NAME = 'mp4a';

MP4AudioSampleEntry.propTypes = {
  dataReferenceIndex: PropTypes.number.isRequired,
  channelCount: PropTypes.oneOf([1, 2]),
  sampleSize: PropTypes.number,
  sampleRate: PropTypes.number
};

MP4AudioSampleEntry.defaultProps = {
  channelCount: 1, // mono
  sampleSize: 16,
  sampleRate: 44100
};

MP4AudioSampleEntry.spec = {
  container: 'stsd',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = MP4AudioSampleEntry;