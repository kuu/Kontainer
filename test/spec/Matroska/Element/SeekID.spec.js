import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('SeekID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        83, 171, 132, 26, 69, 223, 163, // EBML-id [53][AB], size=4 [84], id=[1A][45][DF][A3] :EBML
      ];

  it('should parse/serialize the SeekID element', () => {
    const element1 = <SeekID value="EBML" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
