import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('AlphaMode', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        83, 192, 129, 1, // EBML-id [53][C0], size=1 [81], hasAlpha
      ];

  it('should parse/serialize the AlphaMode element', () => {
    const element1 = <AlphaMode value={true} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
