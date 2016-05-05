import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TrackType', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        131, 129, 1, // EBML-id [83], size=1 [81], type=video [1]
      ];

  it('should parse/serialize the TrackType element', () => {
    const element1 = <TrackType kind="video" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
