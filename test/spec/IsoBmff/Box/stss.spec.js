import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('SyncSampleBox', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });
  
  const value1 = [
        0, 0, 0, 16, // size=16
        115, 116, 115, 115, // type='stss'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 0 // entry_count=0
      ],
      value2 = [
        0, 0, 0, 28, // size=28
        115, 116, 115, 115, // type='stss'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 3, // entry_count=3
        0, 0, 0, 1, // sample_number=1
        0, 0, 0, 2, // sample_number=1
        0, 0, 0, 3 // sample_number=1
      ];

  it('supports zero entry', () => {
    const stssElement = <stss entries={[]} />;
    const buffer = Kontainer.render(stssElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stssElement).toHaveTheSameProps(element);
  });

  it('supports multiple entries', () => {
    const stssElement = <stss entries={[1, 2, 3]} />;
    const buffer = Kontainer.render(stssElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stssElement).toHaveTheSameProps(element);
  });
});
