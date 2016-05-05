import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Channels', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        159, 129, 2, // EBML-id [9F], size=1 [81], channels=stereo
      ];

  it('should parse/serialize the Channels element', () => {
    const element1 = <Channels value={2} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
