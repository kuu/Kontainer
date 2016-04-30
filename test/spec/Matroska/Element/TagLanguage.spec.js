import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TagLanguage', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
      ];

  it('should parse/serialize the TagLanguage element', () => {
    const element1 = <TagLanguage value={"jpn"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
