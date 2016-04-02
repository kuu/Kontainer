import customMatchers from '../../helper/matcher';
import Kontainer from '../../../src/';

describe('MovieFragmentHeaderBox', function () {
  var IsoBmff = Kontainer.IsoBmff,
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

  it('supports the smallest sequence number.', function () {
    var mfhdElement = IsoBmff.createElement('mfhd', {sequenceNumber: 0});
    var buffer = Kontainer.renderToBuffer(mfhdElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(mfhdElement, element)).toBe(true);
  });

  it('supports the largest sequence number.', function () {
    var mfhdElement = IsoBmff.createElement('mfhd', {sequenceNumber: 0xFFFFFFFF});
    var buffer = Kontainer.renderToBuffer(mfhdElement);
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
    expect(customMatchers.toHaveTheSamePropsAs(mfhdElement, element)).toBe(true);
  });
});
