import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('WritingApp', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
    87, 65, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [57][41], size=12 [8C], title="kontainer-js"
  ];

  it('should parse/serialize the WritingApp element', () => {
    const element1 = <WritingApp value="kontainer-js" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
