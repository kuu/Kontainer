import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('FlagDefault', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        136, 129, 0, // EBML-id [88], size=1 [81], isNotDefault
      ];

  it('should parse/serialize the FlagDefault element', () => {
    const element1 = <FlagDefault value={false} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
