import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ChapLanguage', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
      ];

  it('should parse/serialize the ChapLanguage element', () => {
    const element1 = <ChapLanguage value={"jpn"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
