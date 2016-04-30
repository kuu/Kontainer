import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('BlockDuration', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        155, 130, 2, 148, // EBML-id [9B], size=2 [82], duration=660 [02][94]
      ];

  it('should parse/serialize the BlockDuration element', () => {
    const element1 = <BlockDuration value={660} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
