import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('AspectRatioType', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 179, 129, 1, // EBML-id [54][B3], size=1 [81], kind=keep
      ];

  it('should parse/serialize the AspectRatioType element', () => {
    const element1 = <AspectRatioType kind={"keep"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
