import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('BitDepth', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        98, 100, 129, 8, // EBML-id [62][64], size=1 [81], depth=8
      ];

  it('should parse/serialize the BitDepth element', () => {
    const element1 = <BitDepth value={8} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
