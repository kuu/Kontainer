import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('PixelHeight', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        186, 130, 4, 56, // EBML-id [BA], size=2 [82], height=1080
      ];

  it('should parse/serialize the PixelHeight element', () => {
    const element1 = <PixelHeight value={1080} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
