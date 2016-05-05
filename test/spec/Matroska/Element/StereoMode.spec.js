import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('StereoMode', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        83, 184, 129, 13, // EBML-id [53][B8], size=1 [81], mode=both eyes laced in one Block [0D]
      ];

  it('should parse/serialize the StereoMode element', () => {
    const element1 = <StereoMode kind="bothEyesLacedInOneBlock-LeftFirst" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
