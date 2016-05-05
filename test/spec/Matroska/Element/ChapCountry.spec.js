import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ChapCountry', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        67, 126, 130, 106, 112, // EBML-id [43][7E], size=2 [82], country="jp"
      ];

  it('should parse/serialize the ChapCountry element', () => {
    const element1 = <ChapCountry value={"jp"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
