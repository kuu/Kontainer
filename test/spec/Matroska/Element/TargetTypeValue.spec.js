import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TargetTypeValue', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        104, 202, 129, 48, // EBML-id [68][CA], size=1 [81], value=0x30
      ];

  it('should parse/serialize the TargetTypeValue element', () => {
    const element1 = <TargetTypeValue value={0x30} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
