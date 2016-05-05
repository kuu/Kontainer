import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Duration', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        68, 137, 136, 0, 1, 0, 0, 0, 0, 0, 0, // EBML-id [44][89], size=8 [88], duration=65536.0 [00][01][00][00][00][00][00][00]
      ];

  it('should parse/serialize the Duration element', () => {
    const element1 = <Duration value={65536} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
