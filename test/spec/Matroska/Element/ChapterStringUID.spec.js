import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ChapterStringUID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
      ];

  it('should parse/serialize the ChapterStringUID element', () => {
    const element1 = <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});