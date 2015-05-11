'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var SampleEntry = require('./SampleEntry'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

var VisualSampleEntry = (function (_SampleEntry) {
  function VisualSampleEntry(type, props) {
    _classCallCheck(this, VisualSampleEntry);

    _get(Object.getPrototypeOf(VisualSampleEntry.prototype), 'constructor', this).call(this, type, props, props.dataReferenceIndex);
  }

  _inherits(VisualSampleEntry, _SampleEntry);

  _createClass(VisualSampleEntry, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- VisualSampleEntry.serialize enter.');
      var props = this.props,
          width = props.width,
          height = props.height,
          horizResolution = props.horizResolution,
          vertResolution = props.vertResolution,
          frameCount = props.frameCount,
          compressorName = props.compressorName,
          depth = props.depth,
          base = offset;

      base += _get(Object.getPrototypeOf(VisualSampleEntry.prototype), 'serialize', this).call(this, buffer, base);

      base += Writer.writeNumber(0, buffer, base, 16); // reserved (32)[4]
      base += Writer.writeNumber(width, buffer, base, 2);
      base += Writer.writeNumber(height, buffer, base, 2);
      base += Writer.writeFixedNumber(horizResolution, buffer, base, 4);
      base += Writer.writeFixedNumber(vertResolution, buffer, base, 4);
      base += Writer.writeNumber(0, buffer, base, 4); // reserved (32)
      base += Writer.writeNumber(frameCount, buffer, base, 2);
      base += Writer.writeNumber(Math.min(compressorName.length, 31), buffer, base, 1);
      base += Writer.writeString(compressorName, buffer, base, 31);
      base += Writer.writeNumber(depth, buffer, base, 2);
      base += Writer.writeNumber(-1, buffer, base, 2); // pre_defined=-1 (16)

      _get(Object.getPrototypeOf(VisualSampleEntry.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log('--- VisualSampleEntry.serialize exit.');
      return this.size;
    }
  }], [{
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          width,
          height,
          horizResolution,
          vertResolution,
          frameCount,
          compressorName,
          compressorNameLength,
          depth;

      var _SampleEntry$parse = SampleEntry.parse(buffer, base);

      var _SampleEntry$parse2 = _slicedToArray(_SampleEntry$parse, 2);

      readBytesNum = _SampleEntry$parse2[0];
      props = _SampleEntry$parse2[1];

      base += readBytesNum;

      base += 16; // skip reserved

      var _Reader$readNumber = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      width = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      height = _Reader$readNumber32[1];

      base += readBytesNum;

      var _Reader$readFixedNumber = Reader.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumber2 = _slicedToArray(_Reader$readFixedNumber, 2);

      readBytesNum = _Reader$readFixedNumber2[0];
      horizResolution = _Reader$readFixedNumber2[1];

      base += readBytesNum;

      var _Reader$readFixedNumber3 = Reader.readFixedNumber(buffer, base, 4);

      var _Reader$readFixedNumber32 = _slicedToArray(_Reader$readFixedNumber3, 2);

      readBytesNum = _Reader$readFixedNumber32[0];
      vertResolution = _Reader$readFixedNumber32[1];

      base += readBytesNum;

      base += 4; // skip reserved

      var _Reader$readNumber4 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

      readBytesNum = _Reader$readNumber42[0];
      frameCount = _Reader$readNumber42[1];

      base += readBytesNum;

      var _Reader$readNumber5 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber52 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber52[0];
      compressorNameLength = _Reader$readNumber52[1];

      base += readBytesNum;

      var _Reader$readString = Reader.readString(buffer, base, Math.min(compressorNameLength, 31));

      var _Reader$readString2 = _slicedToArray(_Reader$readString, 2);

      readBytesNum = _Reader$readString2[0];
      compressorName = _Reader$readString2[1];

      base += 31;

      var _Reader$readNumber6 = Reader.readNumber(buffer, base, 2);

      var _Reader$readNumber62 = _slicedToArray(_Reader$readNumber6, 2);

      readBytesNum = _Reader$readNumber62[0];
      depth = _Reader$readNumber62[1];

      base += readBytesNum;

      base += 2; // skip pre_defined

      props.width = width;
      props.height = height;
      props.horizResolution = horizResolution;
      props.vertResolution = vertResolution;
      props.frameCount = frameCount;
      props.compressorName = compressorName;
      props.depth = depth;

      return [base - offset, props];
    }
  }]);

  return VisualSampleEntry;
})(SampleEntry);

module.exports = VisualSampleEntry;