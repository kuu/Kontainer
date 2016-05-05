import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('EBMLMaxIDLength', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        66, 242, 129, 4, // EBML-id [42][F2], size=1 [81], max id length=4
      ];

  it('should parse/serialize the EBMLMaxIDLength element', () => {
    const element1 = <EBMLMaxIDLength value={4} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
