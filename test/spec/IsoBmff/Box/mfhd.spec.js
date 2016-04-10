import customMatchers from '../../../helper/matcher';
import Kontainer from 'kontainer-js';

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
    let array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(value1.length);
    for (let i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value1[i]);
    }
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(mfhdElement, element)).toBe(true);
  });

  it('supports the largest sequence number.', () => {
    const mfhdElement = <mfhd sequenceNumber={0xFFFFFFFF} />;
    const buffer = Kontainer.renderToBuffer(mfhdElement);
    expect(buffer).not.toBe(null);
    let array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(value2.length);
    for (let i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value2[i]);
    }
    const element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(mfhdElement, element)).toBe(true);
  });
});
