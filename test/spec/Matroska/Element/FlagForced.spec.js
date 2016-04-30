import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('FlagForced', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        85, 170, 129, 1, // EBML-id [55][AA], size=1 [81], isForced
      ];

  it('should parse/serialize the FlagForced element', () => {
    const element1 = <FlagForced value={true} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
