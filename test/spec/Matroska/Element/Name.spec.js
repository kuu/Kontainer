import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Name', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        83, 110, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [53][6E], size=21 [95], name=”I'm a seagull" in Japanese
      ];

  it('should parse/serialize the Name element', () => {
    const element1 = <Name value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
