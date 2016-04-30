import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ChapterTimeEnd', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        146, 134, 6, 140, 97, 113, 64, 0, // EBML-id [92], size=6 [86], duration=2 hours (in nanosec)
      ];

  it('should parse/serialize the ChapterTimeEnd element', () => {
    const element1 = <ChapterTimeEnd value={7200000000000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
