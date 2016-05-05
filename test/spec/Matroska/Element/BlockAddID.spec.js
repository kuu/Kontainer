import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('BlockAddID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        238, 130, 1, 244, // EBML-id [EE], size=2 [82], id=500 [41][f4]
      ];

  it('should parse/serialize the BlockAddID element', () => {
    const element1 = <BlockAddID value={500} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
