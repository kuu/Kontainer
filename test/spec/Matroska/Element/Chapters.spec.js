import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Chapters', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        16, 67, 167, 112, 16, 0, 1, 228, // EBML-id [10][43][A7][70], size=484 [10][00][01][E4]
        69, 185, 64, 238, // EBML-id [45][B9], size=238 [40][EE]
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        69, 185, 64, 238, // EBML-id [45][B9], size=238 [40][EE]
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        182, 64, 116, // EBML-id [B6], size=116 [40][74]
        115, 196, 129, 127, // EBML-id [73][C4], size=1 [81], id=127
        86, 84, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [56][54], size=21 [95], id=”I'm a seagull" in Japanese
        145, 134, 6, 140, 97, 113, 64, 0, // EBML-id [91], size=6 [86], duration=2 hours (in nanosec)
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
        128, 162, // EBML-id [80], size=34 [A2]
        133, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [85], size=21 [95], id=”I'm a seagull" in Japanese
        67, 124, 131, 106, 112, 110, // EBML-id [43][7C], size=3 [83], country="jpn"
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
      ];

  it('should parse/serialize the Chapters element', () => {
    const element1 = <Chapters>
      <EditionEntry>
        <ChapterAtom>
          <ChapterUID value={127} />
          <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <ChapterTimeStart value={7200000000000} />
          <ChapterTimeEnd value={7200000000000} />
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
        </ChapterAtom>
        <ChapterAtom>
          <ChapterUID value={127} />
          <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <ChapterTimeStart value={7200000000000} />
          <ChapterTimeEnd value={7200000000000} />
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
        </ChapterAtom>
      </EditionEntry>
      <EditionEntry>
        <ChapterAtom>
          <ChapterUID value={127} />
          <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <ChapterTimeStart value={7200000000000} />
          <ChapterTimeEnd value={7200000000000} />
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
        </ChapterAtom>
        <ChapterAtom>
          <ChapterUID value={127} />
          <ChapterStringUID value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
          <ChapterTimeStart value={7200000000000} />
          <ChapterTimeEnd value={7200000000000} />
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
          <ChapterDisplay>
            <ChapString value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
            <ChapLanguage value={"jpn"} />
            <ChapCountry value={"jp"} />
          </ChapterDisplay>
        </ChapterAtom>
      </EditionEntry>
    </Chapters>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    /*
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    */
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
