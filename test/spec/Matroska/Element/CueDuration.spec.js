import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CueDuration', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
      ];

  it('should parse/serialize the CueDuration element', () => {
    const element1 = <CueDuration value={33000000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
