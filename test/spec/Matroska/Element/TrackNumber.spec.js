import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TrackNumber', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        215, 129, 127, // EBML-id [D7], size=1 [81], track number=127
      ];

  it('should parse/serialize the TrackNumber element', () => {
    const element1 = <TrackNumber value={127} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
