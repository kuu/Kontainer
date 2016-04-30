import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('DisplayUnit', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 178, 129, 3, // EBML-id [54][B2], size=1 [81], kind=aspectRatio
      ];

  it('should parse/serialize the DisplayUnit element', () => {
    const element1 = <DisplayUnit kind={"aspectRatio"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
