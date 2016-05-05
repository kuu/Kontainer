import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TagName', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
      ];

  it('should parse/serialize the TagName element', () => {
    const element1 = <TagName value={"Prince"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
