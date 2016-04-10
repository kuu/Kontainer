import customMatchers from '../../../helper/matcher';
import Kontainer from 'kontainer-js';

describe('MovieExtendsHeaderBox', () => {
  const IsoBmff = Kontainer.IsoBmff,
      value1 = [
        0, 0, 0, 16, // size=16
        109, 101, 104, 100, // type='mehd'
        0, 0, 0, 0, // version=0, flags=0
        1, 0, 0, 0 // fragment_duration=16777216
      ],
      value2 = [
        0, 0, 0, 20, // size=20
        109, 101, 104, 100, // type='mehd'
        1, 0, 0, 0, // version=1, flags=0
        0, 0, 0, 1, // fragment_duration=4294967296
        0, 0, 0, 0
      ];

  it('supports 32 bit duration', () => {
    const mehdElement = <mehd fragmentDuration={16777216} />;
    const buffer = Kontainer.renderToBuffer(mehdElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(mehdElement, element)).toBe(true);
  });

  it('supports 64 bit duration', () => {
    const mehdElement = <mehd version={1} fragmentDuration={4294967296} />;
    const buffer = Kontainer.renderToBuffer(mehdElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(mehdElement, element)).toBe(true);
  });
});
