import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('EBMLVersion', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        66, 134, 129, 1, // EBML-id [42][86], size=1 [81], version=1
      ];

  it('should parse/serialize the EBMLVersion element', () => {
    const element1 = <EBMLVersion value={1} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});