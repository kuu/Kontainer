import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('PixelCropLeft', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 204, 129, 60, // EBML-id [54][CC], size=1 [81], left=60px
      ];

  it('should parse/serialize the PixelCropLeft element', () => {
    const element1 = <PixelCropLeft value={60} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
