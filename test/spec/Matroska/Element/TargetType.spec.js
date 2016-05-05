import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TargetType', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        99, 202, 133, 65, 76, 66, 85, 77, // EBML-id [63][CA], size=5 [85], country="ALBUM"
      ];

  it('should parse/serialize the TargetType element', () => {
    const element1 = <TargetType value={"ALBUM"} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
