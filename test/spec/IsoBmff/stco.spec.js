import customMatchers from '../../helper/matcher';
import Kontainer from '../../../src/';

describe('ChunkOffsetBox', () => {
  var IsoBmff = Kontainer.IsoBmff,
      value1 = [
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
    var stcoElement = IsoBmff.createElement('stco');
    var buffer = Kontainer.renderToBuffer(stcoElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(stcoElement, element)).toBe(true);
  });

  it('supports multiple entries', () => {
    var stcoElement = IsoBmff.createElement(
      'stco',
      { entries: [1, 2, 3] }
    );
    var buffer = Kontainer.renderToBuffer(stcoElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(stcoElement, element)).toBe(true);
  });
});
