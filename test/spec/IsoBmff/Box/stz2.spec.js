import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('CompactSampleSizeBox', () => {
  const IsoBmff = Kontainer.IsoBmff,
      value1 = [
        0, 0, 0, 23, // size=23
        115, 116, 122, 50, // type='stz2'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 4, // reserved(24), field_size=4
        0, 0, 0, 5, // sample_count=5
        18, 52, 80 // field_size[1, 2, 3, 4, 5]
      ],
      value2 = [
        0, 0, 0, 25, // size=25
        115, 116, 122, 50, // type='stz2'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 8, // reserved(24), field_size=8
        0, 0, 0, 5, // sample_count=5
        1, 2, 3, 4, // field_size[1, 2, 3, 4, 5]
        5
      ],
      value3 = [
        0, 0, 0, 30, // size=30
        115, 116, 122, 50, // type='stz2'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 16, // reserved(24), field_size=16
        0, 0, 0, 5, // sample_count=5
        0, 1, 0, 2, // field_size[1, 2, 3, 4, 5]
        0, 3, 0, 4,
        0, 5
      ];

  it('handles 4 bit field size', () => {
    const stz2Element = <stz2 {...{fieldSize: 4, sampleSizeEntries: [1, 2, 3, 4, 5]}} />;
    const buffer = Kontainer.renderToBuffer(stz2Element);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stz2Element).toHaveTheSameProps(element);
  });

  it('handles 8 bit field size', () => {
    const stz2Element = <stz2 {...{fieldSize: 8, sampleSizeEntries: [1, 2, 3, 4, 5]}} />;
    const buffer = Kontainer.renderToBuffer(stz2Element);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stz2Element).toHaveTheSameProps(element);
  });

  it('handles 16 bit field size', () => {
    const stz2Element = <stz2 {...{fieldSize: 16, sampleSizeEntries: [1, 2, 3, 4, 5]}} />;
    const buffer = Kontainer.renderToBuffer(stz2Element);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value3);
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stz2Element).toHaveTheSameProps(element);
  });
});
