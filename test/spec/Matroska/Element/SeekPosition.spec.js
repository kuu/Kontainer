import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('SeekPosition', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        83, 172, 131, 1, 0, 0 // EBML-id [53][AC], size=3 [81], position=65536
      ];

  it('should parse/serialize the SeekPosition element', () => {
    const element1 = <SeekPosition value={65536} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
