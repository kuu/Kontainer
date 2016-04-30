import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CueTime', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        179, 134, 6, 140, 97, 113, 64, 0, // EBML-id [B3], size=6 [86], timestamp=2 hours (in nanosec)
      ];

  it('should parse/serialize the CueTime element', () => {
    const element1 = <CueTime value={7200000000000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
