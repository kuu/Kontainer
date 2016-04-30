import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TimecodeScale', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        42, 215, 177, 131, 30, 132, 128, // EBML-id [2A][D7][B1], size=3 [83], timestamp scale=2000000(ns) [1E][84][80]
      ];

  it('should parse/serialize the TimecodeScale element', () => {
    const element1 = <TimecodeScale value={2000000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
