import Konatiner from 'kontainer-js';
import testDataMp4 from '../helper/IsoBmff';

describe('Konatiner', () => {

  it('should be able to detect mp4/webm', () => {
    const bufMp4 = testDataMp4.buffer;
    expect(Konatiner.checkContainerFormat(bufMp4)).toBe('mp4');

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
    expect(Konatiner.checkContainerFormat(bufWebm)).toBe('webm');
  });
});
