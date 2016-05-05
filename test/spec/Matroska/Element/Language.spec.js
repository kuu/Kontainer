import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Language', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        34, 181, 156, 131, 106, 112, 110, // EBML-id [22][B5][9C], size=3 [83], country="jpn"
      ];

  it('should parse/serialize the Language element', () => {
    const element1 = <Language value={"jpn"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
