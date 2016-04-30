import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TagString', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
      ];

  it('should parse/serialize the TagString element', () => {
    const element1 = <TagString value={"Prince and Revolution"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
