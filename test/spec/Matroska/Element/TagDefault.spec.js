import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TagDefault', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
      ];

  it('should parse/serialize the TagDefault element', () => {
    const element1 = <TagDefault value={false} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
