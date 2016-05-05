import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Targets', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        99, 192, 144, // EBML-id [63][C0], size=16 [90]
        104, 202, 129, 48, // EBML-id [68][CA], size=1 [81], value=0x30
        99, 202, 133, 65, 76, 66, 85, 77, // EBML-id [63][CA], size=5 [85], country="ALBUM"
        99, 197, 129, 127, // EBML-id [63][C5], size=1 [81], id=127
      ];

  it('should parse/serialize the Targets element', () => {
    const element1 = <Targets>
      <TargetTypeValue value={0x30} />
      <TargetType value={"ALBUM"} />
      <TagTrackUID value={127} />
    </Targets>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
