import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('DocType', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        66, 130, 132, 119, 101, 98, 109, // EBML-id [42][82], size=4 [84], doc type="webm"
      ];

  it('should parse/serialize the DocType element', () => {
    const element1 = <DocType value="webm" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
