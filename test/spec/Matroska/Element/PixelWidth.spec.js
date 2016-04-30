import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('PixelWidth', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        176, 130, 7, 128, // EBML-id [B0], size=2 [82], width=1920
      ];

  it('should parse/serialize the PixelWidth element', () => {
    const element1 = <PixelWidth value={1920} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
