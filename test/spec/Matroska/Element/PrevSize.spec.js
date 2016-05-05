import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('PrevSize', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        171, 131, 1, 0, 0, // EBML-id [ab], size=3 [83], version=65536
      ];

  it('should parse/serialize the PrevSize element', () => {
    const element1 = <PrevSize value={65536} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
