import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Seek', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        77, 187, 141, // EBML-id [4D][BB], size=13 [8d],
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
        83, 172, 131, 1, 0, 0 // EBML-id [53][AC], size=3 [81], position=65536
      ];

  it('should parse/serialize the Seek element', () => {
    const element1 = <Seek>
      <SeekID value="EBML" />
      <SeekPosition value={65536} />
    </Seek>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
