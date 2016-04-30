import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CueRelativePosition', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
      ];

  it('should parse/serialize the CueRelativePosition element', () => {
    const element1 = <CueRelativePosition value={1280} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
