import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('CompactSampleSizeBox', () => {
  const value1 = [
        0, 0, 0, 20, // size=20
        115, 116, 115, 122, // type='stsz'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 5, // sample_size=5
        0, 0, 0, 0 // sample_count=0
      ],
      value2 = [
        0, 0, 0, 32, // size=30
        115, 116, 115, 122, // type='stsz'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 0, // sample_size=0
        0, 0, 0, 3, // sample_count=3
        0, 0, 0, 1, // entry_size[1, 2, 3]
        0, 0, 0, 2,
        0, 0, 0, 3
      ];

  it('supports constant size', () => {
    const stszElement = <stsz sampleSize={5} />;
    const buffer = Kontainer.render(stszElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stszElement).toHaveTheSameProps(element);
  });

  it('supports variable size', () => {
    const stszElement = <stsz sampleSizeEntries={[1, 2, 3]} />;
    const buffer = Kontainer.render(stszElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stszElement).toHaveTheSameProps(element);
  });
});
