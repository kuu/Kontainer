import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('PixelCropBottom', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 170, 129, 80, // EBML-id [54][AA], size=1 [81], bottom=80px
      ];

  it('should parse/serialize the PixelCropBottom element', () => {
    const element1 = <PixelCropBottom value={80} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
