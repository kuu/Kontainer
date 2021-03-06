import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('AVCConfigurationBox', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });

  const avcCValue = [
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

  it('can wrrap raw bytes', () => {
    let sps, pps;
    if (global && global.Buffer) {
      sps = new Buffer(8);
      pps = new Buffer(8);
    } else {
      sps = new Uint8Array(8);
      pps = new Uint8Array(8);
    }
    for (let i = 0; i < 8; i++) {
      sps[i] = (1 << i);
    }
    for (let i = 0, j = 7; i < 8; i++, j--) {
      pps[i] = (1 << j);
    }
    let element = <avcC {...{
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
    }} />;
    let buffer = Kontainer.render(element);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(avcCValue);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element).toHaveTheSameProps(element2);
  });
});
