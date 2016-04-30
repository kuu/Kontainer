import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('DisplayWidth', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        84, 176, 130, 6, 224, // EBML-id [54][B0], size=2 [82], width=1760
      ];

  it('should parse/serialize the DisplayWidth element', () => {
    const element1 = <DisplayWidth value={1760} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
