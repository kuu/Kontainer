import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ContentEncodingType', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
      ];

  it('should parse/serialize the ContentEncodingType element', () => {
    const element1 = <ContentEncodingType kind="encryption" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
