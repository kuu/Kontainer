import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CodecID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        134, 136, 65, 95, 86, 79, 82, 66, 73, 83, // EBML-id [86], size=8 [88], codec id="A_VORBIS"
      ];

  it('should parse/serialize the CodecID element', () => {
    const element1 = <CodecID value={"A_VORBIS"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
