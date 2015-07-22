/*global describe, it, expect */
describe('AVCConfigurationBox', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
      avcCValue = [
        0, 0, 0, 35, // size=35
        97, 118, 99, 67, // type='avcC'
        1, 66, 0, 21, // configurationVersion=1, AVCProfileIndication='baseline', profile_compatibility=0:false,1:false,2:false, AVCLevelIndication=2.1
        255, 225, 0, 8, // lengthSizeMinusOne=3, numOfSequenceParameterSets=1, sequenceParameterSetLength=8
        1, 2, 4, 8, // sequenceParameterSetNALUnit
        16, 32, 64, 128,
        1, 0, 8, // numOfPictureParameterSets=1, pictureParameterSetLength=8
        128, 64, 32, 16, // pictureParameterSetNALUnit
        8, 4, 2, 1
      ];

  it('can wrrap raw bytes', function () {
    var sps = new Buffer(8);
    for (let i = 0; i < 8; i++) {
      sps[i] = (1 << i);
    }
    var pps = new Buffer(8);
    for (let i = 0, j = 7; i < 8; i++, j--) {
      pps[i] = (1 << j);
    }
    var buffer = Kontainer.renderToBuffer(IsoBmff.createElement(
      'avcC',
      {
        avcProfileIndication: 'baseline',
        profileCompatibility: {
          constraintSet0Flag: false,
          constraintSet1Flag: false,
          constraintSet2Flag: false
        },
        avcLevelIndication: 2.1,
        lengthSize: 4,
        sequenceParameterSets: [
          {length: 8, data: sps}
        ],
        pictureParameterSets: [
          {length: 8, data: pps}
        ]
      }
    ));
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
    }
  });
});
