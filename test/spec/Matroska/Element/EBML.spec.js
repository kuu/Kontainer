import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('EBML', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        26, 69, 223, 163, 16, 0, 0, 31, // EBML id [1A][45][DF][A3], size=31 [10][00][00][1F]
        66, 134, 129, 1, // EBMLVersion id [42][86], size=1 [81], version=1
        66, 247, 129, 1, // EBMLReadVersion id [42][F7], size=1 [81], version=1
        66, 242, 129, 4, // EBMLMaxIDLength id [42][F2], size=1 [81], max id length=4
        66, 243, 129, 8, // EBMLMaxSizeLength id [42][F3], size=1 [81], max size length=8
        66, 130, 132, 119, 101, 98, 109, // DocType id [42][82], size=4 [84], doc type="webm"
        66, 135, 129, 1, // DocTypeVersion id [42][87], size=1 [81], version=1
        66, 133, 129, 1, // DocTypeReadVersion id [42][85], size=1 [81], version=1
      ];

  it('should parse/serialize the EBML element', () => {
    const element1 = <EBML>
      <EBMLVersion value={1} />
      <EBMLReadVersion value={1} />
      <EBMLMaxIDLength value={4} />
      <EBMLMaxSizeLength value={8} />
      <DocType value="webm" />
      <DocTypeVersion value={1} />
      <DocTypeReadVersion value={1} />
    </EBML>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    /*
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    */
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
