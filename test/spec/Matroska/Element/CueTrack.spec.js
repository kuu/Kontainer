import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CueTrack', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
      ];

  it('should parse/serialize the CueTrack element', () => {
    const element1 = <CueTrack value={127} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
