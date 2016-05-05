import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ChapterUID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
      ];

  it('should parse/serialize the ChapterUID element', () => {
    const element1 = <ChapterUID value={127} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
