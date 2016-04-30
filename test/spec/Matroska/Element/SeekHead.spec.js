import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('SeekHead', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        17, 77, 155, 116, 64, 30, // EBML-id [11][4D][9B][74] size=30 [40][1E]
        77, 187, 139, // EBML-id [4D][BB], size=11 [8B]
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 129, 64, // EBML-id [53][AC], size=1 [81], position=64
        77, 187, 141, // EBML-id [4D][BB], size=13 [8D],
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 131, 1, 0, 0, // EBML-id [53][AC], size=3 [83], position=65536
      ];

  it('should parse/serialize the SeekHead element', () => {
    const element1 = <SeekHead>
      <Seek>
        <SeekID value="EBML" />
        <SeekPosition value={64} />
      </Seek>
      <Seek>
        <SeekID value="EBML" />
        <SeekPosition value={65536} />
      </Seek>
    </SeekHead>;
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
