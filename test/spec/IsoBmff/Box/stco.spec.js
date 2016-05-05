import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('ChunkOffsetBox', () => {
  const value1 = [
        0, 0, 0, 16, // size=16
        115, 116, 99, 111, // type='stco'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 0 // entry_count=0
      ],
      value2 = [
        0, 0, 0, 28, // size=28
        115, 116, 99, 111, // type='stco'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 3, // entry_count=3
        0, 0, 0, 1, // chunk_offset=1
        0, 0, 0, 2, // chunk_offset=2
        0, 0, 0, 3 // chunk_offset=3
      ];

  it('supports zero entry', () => {
    const stcoElement = <stco />;
    const buffer = Kontainer.render(stcoElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stcoElement).toHaveTheSameProps(element);
  });

  it('supports multiple entries', () => {
    const stcoElement = <stco entries={[1, 2, 3]} />;
    const buffer = Kontainer.render(stcoElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stcoElement).toHaveTheSameProps(element);
  });
});
