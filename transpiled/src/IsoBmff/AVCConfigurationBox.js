'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader'),
    Buffer = require('../core/Buffer');

var AVCConfigurationBox = (function (_Box) {
  _inherits(AVCConfigurationBox, _Box);

  function AVCConfigurationBox(props) {
    _classCallCheck(this, AVCConfigurationBox);

    _get(Object.getPrototypeOf(AVCConfigurationBox.prototype), 'constructor', this).call(this, AVCConfigurationBox.COMPACT_NAME, props);
  }

  _createClass(AVCConfigurationBox, [{
    key: 'serialize',
    value: function serialize(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      //console.log('--- AVCConfigurationBox.serialize enter.');
      var props = this.props,
          configurationVersion = props.configurationVersion,
          avcProfileIndication = props.avcProfileIndication,
          profileCompatibility = props.profileCompatibility,
          avcLevelIndication = props.avcLevelIndication,
          lengthSizeMinusOne = props.lengthSize - 1,
          sequenceParameterSets = props.sequenceParameterSets,
          pictureParameterSets = props.pictureParameterSets,
          i,
          length,
          data,
          base = offset;

      base += _get(Object.getPrototypeOf(AVCConfigurationBox.prototype), 'serialize', this).call(this, buffer, base);
      base += Writer.writeNumber(configurationVersion, buffer, base, 1);
      base += Writer.writeNumber(AVCConfigurationBox.encodeProfile(avcProfileIndication), buffer, base, 1);
      base += Writer.writeNumber(AVCConfigurationBox.encodeCompatibility(profileCompatibility), buffer, base, 1);
      base += Writer.writeNumber(avcLevelIndication * 10 | 0, buffer, base, 1);
      base += Writer.writeNumber(0xFC | lengthSizeMinusOne, buffer, base, 1);
      base += Writer.writeNumber(0xE0 | sequenceParameterSets.length, buffer, base, 1);
      sequenceParameterSets.forEach(function (sps) {
        length = sps.length;
        data = sps.data;
        base += Writer.writeNumber(length, buffer, base, 2);
        if (buffer) {
          for (i = 0; i < length; i++) {
            buffer[base++] = data[i];
          }
        } else {
          base += length;
        }
      });
      base += Writer.writeNumber(pictureParameterSets.length, buffer, base, 1);
      pictureParameterSets.forEach(function (pps) {
        length = pps.length;
        data = pps.data;
        base += Writer.writeNumber(length, buffer, base, 2);
        if (buffer) {
          for (i = 0; i < length; i++) {
            buffer[base++] = data[i];
          }
        } else {
          base += length;
        }
      });

      _get(Object.getPrototypeOf(AVCConfigurationBox.prototype), 'setSize', this).call(this, base - offset, buffer, offset);

      //console.log(`--- AVCConfigurationBox.serialize exit. size=${this.size}`);
      return this.size;
    }
  }], [{
    key: 'encodeProfile',
    value: function encodeProfile(profile) {
      var p = 0;
      if (profile === 'baseline') {
        p = 66;
      } else if (profile === 'main') {
        p = 77;
      } else if (profile === 'extended') {
        p = 88;
      }
      return p;
    }
  }, {
    key: 'decodeProfile',
    value: function decodeProfile(p) {
      var profile = '';
      if (p === 66) {
        profile = 'baseline';
      } else if (p === 77) {
        profile = 'main';
      } else if (p === 88) {
        profile = 'extended';
      } else {
        console.error('IsoBmff.AVConfigurationBox.parse: Unknown profile - ' + p);
      }
      return profile;
    }
  }, {
    key: 'encodeCompatibility',
    value: function encodeCompatibility(compat) {
      var c = 0;
      if (compat.constraintSet0Flag) {
        c |= 0x01;
      }
      if (compat.constraintSet1Flag) {
        c |= 0x02;
      }
      if (compat.constraintSet2Flag) {
        c |= 0x04;
      }
      return c;
    }
  }, {
    key: 'decodeCompatibility',
    value: function decodeCompatibility(c) {
      var compat = {
        constraintSet0Flag: false,
        constraintSet1Flag: false,
        constraintSet2Flag: false
      };
      if (c & 0x01) {
        compat.constraintSet0Flag = true;
      }
      if (c & 0x02) {
        compat.constraintSet1Flag = true;
      }
      if (c & 0x04) {
        compat.constraintSet2Flag = true;
      }
      return compat;
    }
  }, {
    key: 'parse',
    value: function parse(buffer) {
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      var base = offset,
          readBytesNum,
          props,
          i,
          j,
          length,
          data,
          buf,
          configurationVersion,
          avcProfileIndication,
          profileCompatibility,
          avcLevelIndication,
          lengthSizeMinusOne,
          numOfParameterSets,
          sequenceParameterSets = [],
          pictureParameterSets = [];

      var _Box$parse = Box.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      configurationVersion = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber32 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber32[0];
      avcProfileIndication = _Reader$readNumber32[1];

      base += readBytesNum;

      var _Reader$readNumber4 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber42 = _slicedToArray(_Reader$readNumber4, 2);

      readBytesNum = _Reader$readNumber42[0];
      profileCompatibility = _Reader$readNumber42[1];

      base += readBytesNum;

      var _Reader$readNumber5 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber52 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber52[0];
      avcLevelIndication = _Reader$readNumber52[1];

      base += readBytesNum;

      var _Reader$readNumber6 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber62 = _slicedToArray(_Reader$readNumber6, 2);

      readBytesNum = _Reader$readNumber62[0];
      lengthSizeMinusOne = _Reader$readNumber62[1];

      base += readBytesNum;

      var _Reader$readNumber7 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber72 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber72[0];
      numOfParameterSets = _Reader$readNumber72[1];

      base += readBytesNum;

      numOfParameterSets &= 0x1F;

      for (i = 0; i < numOfParameterSets; i++) {
        var _Reader$readNumber8 = Reader.readNumber(buffer, base, 2);

        var _Reader$readNumber82 = _slicedToArray(_Reader$readNumber8, 2);

        readBytesNum = _Reader$readNumber82[0];
        length = _Reader$readNumber82[1];

        base += readBytesNum;

        buf = new Buffer(length);
        data = buf.getView();
        for (j = 0; j < length; j++) {
          data[j] = buffer[base++];
        }
        sequenceParameterSets.push({ length: length, data: buf.getView() });
      }

      var _Reader$readNumber9 = Reader.readNumber(buffer, base, 1);

      var _Reader$readNumber92 = _slicedToArray(_Reader$readNumber9, 2);

      readBytesNum = _Reader$readNumber92[0];
      numOfParameterSets = _Reader$readNumber92[1];

      base += readBytesNum;

      for (i = 0; i < numOfParameterSets; i++) {
        var _Reader$readNumber10 = Reader.readNumber(buffer, base, 2);

        var _Reader$readNumber102 = _slicedToArray(_Reader$readNumber10, 2);

        readBytesNum = _Reader$readNumber102[0];
        length = _Reader$readNumber102[1];

        base += readBytesNum;

        buf = new Buffer(length);
        data = buf.getView();
        for (j = 0; j < length; j++) {
          data[j] = buffer[base++];
        }
        pictureParameterSets.push({ length: length, data: buf.getView() });
      }

      props.configurationVersion = configurationVersion;
      props.avcProfileIndication = AVCConfigurationBox.decodeProfile(avcProfileIndication);
      props.profileCompatibility = AVCConfigurationBox.decodeCompatibility(profileCompatibility);
      props.avcLevelIndication = avcLevelIndication / 10;
      props.lengthSize = (lengthSizeMinusOne & 0x03) + 1;
      props.sequenceParameterSets = sequenceParameterSets;
      props.pictureParameterSets = pictureParameterSets;

      return [base - offset, props];
    }
  }]);

  return AVCConfigurationBox;
})(Box);

AVCConfigurationBox.COMPACT_NAME = 'avcC';

AVCConfigurationBox.propTypes = {
  configurationVersion: PropTypes.number,
  avcProfileIndication: PropTypes.oneOf(['baseline', 'main', 'extended']).isRequired,
  profileCompatibility: PropTypes.shape({
    constraintSet0Flag: PropTypes.bool,
    constraintSet1Flag: PropTypes.bool,
    constraintSet2Flag: PropTypes.bool
  }).isRequired,
  avcLevelIndication: PropTypes.oneOf([1, 1.1, 1.2, 1.3, 2, 2.1, 2.2, 3, 3.1, 3.2, 4, 4.1, 4.2, 5, 5.1]).isRequired,
  lengthSize: PropTypes.oneOf([1, 2, 4]).isRequired,
  sequenceParameterSets: PropTypes.arrayOf(PropTypes.shape({
    length: PropTypes.number,
    data: PropTypes.any
  })),
  pictureParameterSets: PropTypes.arrayOf(PropTypes.shape({
    length: PropTypes.number,
    data: PropTypes.any
  }))
};

AVCConfigurationBox.defaultProps = {
  configurationVersion: 1,
  sequenceParameterSets: [],
  pictureParameterSets: []
};

AVCConfigurationBox.spec = {
  container: 'avc1',
  quantity: Box.QUANTITY_EXACTORY_ONE,
  mandatoryBoxList: []
};

module.exports = AVCConfigurationBox;