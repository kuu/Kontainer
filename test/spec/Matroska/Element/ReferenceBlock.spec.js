import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ReferenceBlock', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        251, 129, 33, // EBML-id [FB], size=1 [81], relative timestamp=33 [21]
      ];

  it('should parse/serialize the ReferenceBlock element', () => {
    const element1 = <ReferenceBlock value={33} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
