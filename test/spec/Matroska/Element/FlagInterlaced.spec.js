import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('FlagInterlaced', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        154, 129, 2, // EBML-id [9A], size=1 [81], type=progressive [2]
      ];

  it('should parse/serialize the FlagInterlaced element', () => {
    const element1 = <FlagInterlaced kind="progressive" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
