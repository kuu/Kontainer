import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Title', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        123, 169, 137, 227, 131, 134, 227, 130, 185, 227, 131, 136, // EBML-id [7B][A9], size=9 [89], title="TEST(in Japanese)" [E3, 83, 86, E3, 82, B9, E3, 83, 88]
      ];

  it('should parse/serialize the Title element', () => {
    const element1 = <Title value={'\u30C6\u30B9\u30C8'} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
