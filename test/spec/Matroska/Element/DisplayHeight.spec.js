import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('DisplayHeight', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 186, 130, 3, 192, // EBML-id [54][BA], size=2 [82], height=960
      ];

  it('should parse/serialize the DisplayHeight element', () => {
    const element1 = <DisplayHeight value={960} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
