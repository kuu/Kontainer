import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TrackUID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        115, 197, 132, 255, 255, 255, 255, // EBML-id [73][C5], size=1 [84], id=[FF][FF][FF][FF]
      ];

  it('should parse/serialize the TrackUID element', () => {
    const element1 = <TrackUID value={0xffffffff} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
