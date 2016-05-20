import Kontainer from 'kontainer-js';
import testDataMp4 from '../helper/IsoBmff';
import Buffer from '../../src/core/Buffer';

describe('Kontainer', () => {

  it('should be able to detect mp4/webm', () => {
    const bufMp4 = testDataMp4.buffer;
    expect(Kontainer.checkContainerFormat(bufMp4)).toBe('mp4');

    const bufWebm = [
      26, 69, 223, 163, 16, 0, 0, 31, // EBML id [1A][45][DF][A3], size=31 [10][00][00][1F]
      66, 134, 129, 1, // EBMLVersion id [42][86], size=1 [81], version=1
      66, 247, 129, 1, // EBMLReadVersion id [42][F7], size=1 [81], version=1
      66, 242, 129, 4, // EBMLMaxIDLength id [42][F2], size=1 [81], max id length=4
      66, 243, 129, 8, // EBMLMaxSizeLength id [42][F3], size=1 [81], max size length=8
      66, 130, 132, 119, 101, 98, 109, // DocType id [42][82], size=4 [84], doc type="webm"
      66, 135, 129, 1, // DocTypeVersion id [42][87], size=1 [81], version=1
      66, 133, 129, 1, // DocTypeReadVersion id [42][85], size=1 [81], version=1
    ];
    expect(Kontainer.checkContainerFormat(bufWebm)).toBe('webm');
  });

  it('can ingore unknown boxes', () => {

    const UNKNOWN_BOX_NAME = '    ';
    const unknownValue = [
          0, 0, 0, 40, // size=40
          109, 105, 110, 102, // type='minf'
          0, 0, 0, 16, // size=16
          32, 32, 32, 32, // type=(unknown)
          1, 2, 4, 8,
          16, 32, 64, 128,
          0, 0, 0, 16, // size=16
          100, 114, 101, 102, // type='dref'
          0, 0, 0, 0, // version=0, flags=0
          0, 0, 0, 0, // entry_count=0
        ];

    const element1 = Kontainer.createElementFromBuffer((new Buffer(unknownValue)).getData(), 0, {ignoreUnknown: false});
    expect(element1).not.toBe(null);
    expect(element1.querySelector(UNKNOWN_BOX_NAME)).not.toBe(null);
    const element2 = Kontainer.createElementFromBuffer((new Buffer(unknownValue)).getData(), 0, {ignoreUnknown: true});
    expect(element2).not.toBe(null);
    expect(element2.querySelector(UNKNOWN_BOX_NAME)).toBe(null);
  });
});
