import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ContentEncodingOrder', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
      ];

  it('should parse/serialize the ContentEncodingOrder element', () => {
    const element1 = <ContentEncodingOrder value={0} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
