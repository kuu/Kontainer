import customMatchers from '../../../helper/matcher';
import Kontainer from '../../../../src/';

describe('SyncSampleBox', () => {
  const IsoBmff = Kontainer.IsoBmff,
      value1 = [
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
    const stssElement = IsoBmff.createElement('stss', {entries: []});
    const buffer = Kontainer.renderToBuffer(stssElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(stssElement, element)).toBe(true);
  });

  it('supports multiple entries', () => {
    const stssElement = IsoBmff.createElement('stss', {entries: [1, 2, 3]});
    const buffer = Kontainer.renderToBuffer(stssElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(stssElement, element)).toBe(true);
  });
});