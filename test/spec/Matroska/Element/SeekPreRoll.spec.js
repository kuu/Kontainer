import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('SeekPreRoll', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        86, 187, 132, 59, 154, 202, 0, // EBML-id [56][BB], size=4 [84], time=1sec
      ];

  it('should parse/serialize the SeekPreRoll element', () => {
    const element1 = <SeekPreRoll value={1000000000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
