import customMatchers from '../../helper/matcher';
import sample from '../../helper/IsoBmff';

/*global describe, it, expect */
describe('File', function () {
  var Kontainer = require('../../../src/');
  var IsoBmff = Kontainer.IsoBmff,
      topLevelElement = sample.element,
      value = sample.buffer;

  it('generates a binary data from KontainerElements', function () {
    var buffer, elem, array;

    buffer = Kontainer.renderToBuffer(IsoBmff.createElement('file', null,
      IsoBmff.createElement('moov', null,
        IsoBmff.createElement('mvhd')
      )
    ));
    expect(buffer).toBe(null);

    buffer = Kontainer.renderToBuffer(topLevelElement);
    expect(buffer).not.toBe(null);
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(value.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value[i]);
      //console.log(`array[${i}]=${array[i]}`);
    }
    elem = IsoBmff.createElementFromBuffer(buffer);
    expect(customMatchers.toHaveTheSamePropsAs(topLevelElement, elem)).toBe(true);
  });

  it('parses a binary data into KontainerElements', function () {
    var b, elem, buf, array;

    if (global.Buffer) {
      b = new global.Buffer(value);
    } else {
      buf = new Uint8Array(value);
      b = buf.buffer;
    }
    elem = IsoBmff.createElementFromBuffer(b);
    expect(elem).not.toBe(null);
    buf = Kontainer.renderToBuffer(elem);
    expect(buf).not.toBe(null);
    if (buf instanceof ArrayBuffer) {
      array = new Uint8Array(buf);
    } else {
      array = buf;
    }
    expect(array.length).toBe(value.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value[i]);
    }
  });
});
