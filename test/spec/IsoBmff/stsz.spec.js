import customMatchers from '../../helper/matcher';
import Kontainer from '../../../src/';

describe('CompactSampleSizeBox', () => {
  var IsoBmff = Kontainer.IsoBmff,
      value1 = [
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
    var stszElement = IsoBmff.createElement('stsz', {sampleSize: 5});
    var buffer = Kontainer.renderToBuffer(stszElement);
    expect(buffer).not.toBe(null);
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(value1.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value1[i]);
    }
    var element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(stszElement, element)).toBe(true);
  });

  it('supports variable size', () => {
    var stszElement = IsoBmff.createElement('stsz', {sampleSizeEntries: [1, 2, 3]});
    var buffer = Kontainer.renderToBuffer(stszElement);
    expect(buffer).not.toBe(null);
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(value2.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value2[i]);
    }
    var element = IsoBmff.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(stszElement, element)).toBe(true);
  });
});
