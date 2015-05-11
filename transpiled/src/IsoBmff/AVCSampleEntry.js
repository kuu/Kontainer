'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    VisualSampleEntry = require('./VisualSampleEntry'),
    PropTypes = require('../core/PropTypes');

var AVCSampleEntry = (function (_VisualSampleEntry) {
  function AVCSampleEntry(props) {
    _classCallCheck(this, AVCSampleEntry);

    _get(Object.getPrototypeOf(AVCSampleEntry.prototype), 'constructor', this).call(this, AVCSampleEntry.COMPACT_NAME, props);
  }

  _inherits(AVCSampleEntry, _VisualSampleEntry);

  _createClass(AVCSampleEntry, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- AVCSampleEntry.serialize enter.');
      var base = offset;

      base += _get(Object.getPrototypeOf(AVCSampleEntry.prototype), 'serialize', this).call(this, buffer, base);
      _get(Object.getPrototypeOf(AVCSampleEntry.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- AVCSampleEntry.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props;

      var _VisualSampleEntry$parse = VisualSampleEntry.parse(buffer, base);

      var _VisualSampleEntry$parse2 = _slicedToArray(_VisualSampleEntry$parse, 2);

      readBytesNum = _VisualSampleEntry$parse2[0];
      props = _VisualSampleEntry$parse2[1];

      base += readBytesNum;

      return [base - offset, props];
    }
  }]);

  return AVCSampleEntry;
})(VisualSampleEntry);

AVCSampleEntry.COMPACT_NAME = 'avc1';

AVCSampleEntry.propTypes = {
  dataReferenceIndex: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  horizResolution: PropTypes.number,
  vertResolution: PropTypes.number,
  frameCount: PropTypes.number,
  compressorName: PropTypes.string,
  depth: PropTypes.number
};

AVCSampleEntry.defaultProps = {
  horizResolution: 72,
  vertResolution: 72,
  frameCount: 1,
  compressorName: '',
  depth: 24
};

AVCSampleEntry.spec = {
  container: 'stsd',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = AVCSampleEntry;