import customMatchers from '../../helper/matcher';

/*global describe, it, expect */
describe('CompactSampleSizeBox', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
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

  it('handles 4 bit field size', function () {
    var stz2Element = IsoBmff.createElement('stz2', {fieldSize: 4, sampleSizeEntries: [1, 2, 3, 4, 5]});
    var buffer = Kontainer.renderToArrayBuffer(stz2Element);
    expect(buffer).not.toBe(null);
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(value1.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value1[i]);
    }
    var element = IsoBmff.createElementFromArrayBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(stz2Element, element)).toBe(true);
  });

  it('handles 8 bit field size', function () {
    var stz2Element = IsoBmff.createElement('stz2', {fieldSize: 8, sampleSizeEntries: [1, 2, 3, 4, 5]});
    var buffer = Kontainer.renderToArrayBuffer(stz2Element);
    expect(buffer).not.toBe(null);
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(value2.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value2[i]);
    }
    var element = IsoBmff.createElementFromArrayBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(stz2Element, element)).toBe(true);
  });

  it('handles 16 bit field size', function () {
    var stz2Element = IsoBmff.createElement('stz2', {fieldSize: 16, sampleSizeEntries: [1, 2, 3, 4, 5]});
    var buffer = Kontainer.renderToArrayBuffer(stz2Element);
    expect(buffer).not.toBe(null);
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(value3.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value3[i]);
    }
    var element = IsoBmff.createElementFromArrayBuffer(buffer);
    expect(element).not.toBe(null);
    expect(customMatchers.toHaveTheSamePropsAs(stz2Element, element)).toBe(true);
  });
});
