import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ContentEncodingScope', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
      ];

  it('should parse/serialize the ContentEncodingScope element', () => {
    const element1 = <ContentEncodingScope kind={['frame', 'private']} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
