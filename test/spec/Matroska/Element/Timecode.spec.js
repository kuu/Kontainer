import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Timecode', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        231, 132, 255, 255, 255, 255, // EBML-id [E7], size=4 [84], timestamp=4294967295
      ];

  it('should parse/serialize the Timecode element', () => {
    const element1 = <Timecode value={4294967295} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
