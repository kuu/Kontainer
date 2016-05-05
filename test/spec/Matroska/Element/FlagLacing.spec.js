import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('FlagLacing', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        156, 129, 0, // EBML-id [9C], size=1 [81], notUsingLacing
      ];

  it('should parse/serialize the FlagLacing element', () => {
    const element1 = <FlagLacing value={false} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
