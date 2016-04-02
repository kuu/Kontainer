'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Box2 = require('./Box');

var _Box3 = _interopRequireDefault(_Box2);

var _PropTypes = require('../core/PropTypes');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

var _Writer = require('../core/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Reader = require('../core/Reader');

var _Reader2 = _interopRequireDefault(_Reader);

var _Buffer = require('../core/Buffer');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AVCConfigurationBox = function (_Box) {
  _inherits(AVCConfigurationBox, _Box);

  function AVCConfigurationBox(props) {
    _classCallCheck(this, AVCConfigurationBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AVCConfigurationBox).call(this, AVCConfigurationBox.COMPACT_NAME, props));
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
      base += _Writer2.default.writeNumber(configurationVersion, buffer, base, 1);
      base += _Writer2.default.writeNumber(AVCConfigurationBox.encodeProfile(avcProfileIndication), buffer, base, 1);
      base += _Writer2.default.writeNumber(AVCConfigurationBox.encodeCompatibility(profileCompatibility), buffer, base, 1);
      base += _Writer2.default.writeNumber(avcLevelIndication * 10 | 0, buffer, base, 1);
      base += _Writer2.default.writeNumber(0xFC | lengthSizeMinusOne, buffer, base, 1);
      base += _Writer2.default.writeNumber(0xE0 | sequenceParameterSets.length, buffer, base, 1);
      sequenceParameterSets.forEach(function (sps) {
        length = sps.length;
        data = sps.data;
        base += _Writer2.default.writeNumber(length, buffer, base, 2);
        if (buffer) {
          for (i = 0; i < length; i++) {
            buffer[base++] = data[i];
          }
        } else {
          base += length;
        }
      });
      base += _Writer2.default.writeNumber(pictureParameterSets.length, buffer, base, 1);
      pictureParameterSets.forEach(function (pps) {
        length = pps.length;
        data = pps.data;
        base += _Writer2.default.writeNumber(length, buffer, base, 2);
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

      var _Box$parse = _Box3.default.parse(buffer, base);

      var _Box$parse2 = _slicedToArray(_Box$parse, 2);

      readBytesNum = _Box$parse2[0];
      props = _Box$parse2[1];

      base += readBytesNum;

      var _Reader$readNumber = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber2 = _slicedToArray(_Reader$readNumber, 2);

      readBytesNum = _Reader$readNumber2[0];
      configurationVersion = _Reader$readNumber2[1];

      base += readBytesNum;

      var _Reader$readNumber3 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber4 = _slicedToArray(_Reader$readNumber3, 2);

      readBytesNum = _Reader$readNumber4[0];
      avcProfileIndication = _Reader$readNumber4[1];

      base += readBytesNum;

      var _Reader$readNumber5 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber6 = _slicedToArray(_Reader$readNumber5, 2);

      readBytesNum = _Reader$readNumber6[0];
      profileCompatibility = _Reader$readNumber6[1];

      base += readBytesNum;

      var _Reader$readNumber7 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber8 = _slicedToArray(_Reader$readNumber7, 2);

      readBytesNum = _Reader$readNumber8[0];
      avcLevelIndication = _Reader$readNumber8[1];

      base += readBytesNum;

      var _Reader$readNumber9 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber10 = _slicedToArray(_Reader$readNumber9, 2);

      readBytesNum = _Reader$readNumber10[0];
      lengthSizeMinusOne = _Reader$readNumber10[1];

      base += readBytesNum;

      var _Reader$readNumber11 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber12 = _slicedToArray(_Reader$readNumber11, 2);

      readBytesNum = _Reader$readNumber12[0];
      numOfParameterSets = _Reader$readNumber12[1];

      base += readBytesNum;

      numOfParameterSets &= 0x1F;

      for (i = 0; i < numOfParameterSets; i++) {
        var _Reader$readNumber13 = _Reader2.default.readNumber(buffer, base, 2);

        var _Reader$readNumber14 = _slicedToArray(_Reader$readNumber13, 2);

        readBytesNum = _Reader$readNumber14[0];
        length = _Reader$readNumber14[1];

        base += readBytesNum;

        buf = new _Buffer2.default(length);
        data = buf.getView();
        for (j = 0; j < length; j++) {
          data[j] = buffer[base++];
        }
        sequenceParameterSets.push({ length: length, data: buf.getView() });
      }

      var _Reader$readNumber15 = _Reader2.default.readNumber(buffer, base, 1);

      var _Reader$readNumber16 = _slicedToArray(_Reader$readNumber15, 2);

      readBytesNum = _Reader$readNumber16[0];
      numOfParameterSets = _Reader$readNumber16[1];

      base += readBytesNum;

      for (i = 0; i < numOfParameterSets; i++) {
        var _Reader$readNumber17 = _Reader2.default.readNumber(buffer, base, 2);

        var _Reader$readNumber18 = _slicedToArray(_Reader$readNumber17, 2);

        readBytesNum = _Reader$readNumber18[0];
        length = _Reader$readNumber18[1];

        base += readBytesNum;

        buf = new _Buffer2.default(length);
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
}(_Box3.default);

exports.default = AVCConfigurationBox;


AVCConfigurationBox.COMPACT_NAME = 'avcC';

AVCConfigurationBox.propTypes = {
  configurationVersion: _PropTypes2.default.number,
  avcProfileIndication: _PropTypes2.default.oneOf(['baseline', 'main', 'extended']).isRequired,
  profileCompatibility: _PropTypes2.default.shape({
    constraintSet0Flag: _PropTypes2.default.bool,
    constraintSet1Flag: _PropTypes2.default.bool,
    constraintSet2Flag: _PropTypes2.default.bool
  }).isRequired,
  avcLevelIndication: _PropTypes2.default.oneOf([1, 1.1, 1.2, 1.3, 2, 2.1, 2.2, 3, 3.1, 3.2, 4, 4.1, 4.2, 5, 5.1]).isRequired,
  lengthSize: _PropTypes2.default.oneOf([1, 2, 4]).isRequired,
  sequenceParameterSets: _PropTypes2.default.arrayOf(_PropTypes2.default.shape({
    length: _PropTypes2.default.number,
    data: _PropTypes2.default.any
  })),
  pictureParameterSets: _PropTypes2.default.arrayOf(_PropTypes2.default.shape({
    length: _PropTypes2.default.number,
    data: _PropTypes2.default.any
  }))
};

AVCConfigurationBox.defaultProps = {
  configurationVersion: 1,
  sequenceParameterSets: [],
  pictureParameterSets: []
};

AVCConfigurationBox.spec = {
  container: 'avc1',
  quantity: _Box3.default.QUANTITY_EXACTORY_ONE,
  mandatoryBoxList: []
};