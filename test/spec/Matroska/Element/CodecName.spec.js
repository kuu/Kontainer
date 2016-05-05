import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CodecName', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        37, 134, 136, 146, 227, 129, 136, 227, 129, 131, 227, 129, 161, 228, 186, 140, 229, 133, 173, 229, 155, 155, // EBML-id [25][86][88], size=18 [92], name="H.264" in Japanese
      ];

  it('should parse/serialize the CodecName element', () => {
    const element1 = <CodecName value={"\u3048\u3043\u3061\u4E8C\u516D\u56DB"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
