import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TagTrackUID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        99, 197, 129, 127, // EBML-id [63][C5], size=1 [81], id=127
      ];

  it('should parse/serialize the TagTrackUID element', () => {
    const element1 = <TagTrackUID value={127} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
