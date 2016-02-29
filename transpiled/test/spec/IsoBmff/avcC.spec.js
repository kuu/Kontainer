'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*global describe, it, expect */
describe('AVCConfigurationBox', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
      avcCValue = [0, 0, 0, 35, // size=35
  97, 118, 99, 67, // type='avcC'
  1, 66, 0, 21, // configurationVersion=1, AVCProfileIndication='baseline', profile_compatibility=0:false,1:false,2:false, AVCLevelIndication=2.1
  255, 225, 0, 8, // lengthSizeMinusOne=3, numOfSequenceParameterSets=1, sequenceParameterSetLength=8
  1, 2, 4, 8, // sequenceParameterSetNALUnit
  16, 32, 64, 128, 1, 0, 8, // numOfPictureParameterSets=1, pictureParameterSetLength=8
  128, 64, 32, 16, // pictureParameterSetNALUnit
  8, 4, 2, 1];

  it('can wrrap raw bytes', function () {
    var sps, pps;
    if (global && global.Buffer) {
      sps = new Buffer(8);
      pps = new Buffer(8);
    } else {
      sps = new Uint8Array(8);
      pps = new Uint8Array(8);
    }
    for (var _i = 0; _i < 8; _i++) {
      sps[_i] = 1 << _i;
    }
    for (var _i2 = 0, j = 7; _i2 < 8; _i2++, j--) {
      pps[_i2] = 1 << j;
    }
    var element = IsoBmff.createElement('avcC', {
      avcProfileIndication: 'baseline',
      profileCompatibility: {
        constraintSet0Flag: false,
        constraintSet1Flag: false,
        constraintSet2Flag: false
      },
      avcLevelIndication: 2.1,
      lengthSize: 4,
      sequenceParameterSets: [{ length: 8, data: sps }],
      pictureParameterSets: [{ length: 8, data: pps }]
    });
    var buffer = Kontainer.renderToBuffer(element);
    expect(buffer).not.toBe(null);
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(avcCValue.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(avcCValue[i]);
      //console.log('a[' + i + ']=' + array[i] + ', b[' + i + ']=' + avcCValue[i]);
    }
    var element2 = IsoBmff.createElementFromBuffer(buffer);
    expect(_matcher2.default.toHaveTheSamePropsAs(element, element2)).toBe(true);
  });
});