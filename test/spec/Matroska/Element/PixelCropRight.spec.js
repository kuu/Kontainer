import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('PixelCropRight', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 221, 129, 60, // EBML-id [54][DD], size=1 [81], right=60
      ];

  it('should parse/serialize the PixelCropRight element', () => {
    const element1 = <PixelCropRight value={60} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
