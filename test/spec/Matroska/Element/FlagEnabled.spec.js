import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('FlagEnabled', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        185, 129, 1, // EBML-id [B9], size=1 [81], enabled
      ];

  it('should parse/serialize the FlagEnabled element', () => {
    const element1 = <FlagEnabled value={true} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
