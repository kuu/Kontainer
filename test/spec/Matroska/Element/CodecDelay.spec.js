import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CodecDelay', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        86, 170, 131, 76, 75, 64, // EBML-id [56][AA], size=3 [83], delay=5ms
      ];

  it('should parse/serialize the CodecDelay element', () => {
    const element1 = <CodecDelay value={5000000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
