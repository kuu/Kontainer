import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ChapterDisplay', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
      ];

  it('should parse/serialize the ChapterDisplay element', () => {
    const element1 = <ChapterDisplay>
      <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
      <ChapLanguage value={"jpn"} />
      <ChapCountry value={"jp"} />
    </ChapterDisplay>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
