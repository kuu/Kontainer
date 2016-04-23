import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('MovieFragmentHeaderBox', () => {
  const IsoBmff = Kontainer.IsoBmff,
      value1 = [
        0, 0, 0, 16, // size=16
        109, 102, 104, 100, // type='mfhd'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 0 // sequence_number=0
      ],
      value2 = [
        0, 0, 0, 16, // size=16
        109, 102, 104, 100, // type='mfhd'
        0, 0, 0, 0, // version=0, flags=0
        255, 255, 255, 255 // sequence_number=0xFFFFFFFF
      ];

  it('supports the smallest sequence number.', () => {
    const mfhdElement = <mfhd sequenceNumber={0} />;
    const buffer = Kontainer.renderToBuffer(mfhdElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(mfhdElement).toHaveTheSameProps(element);
  });

  it('supports the largest sequence number.', () => {
    const mfhdElement = <mfhd sequenceNumber={0xFFFFFFFF} />;
    const buffer = Kontainer.renderToBuffer(mfhdElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(mfhdElement).toHaveTheSameProps(element);
  });
});
