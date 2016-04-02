'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _IsoBmff = require('../../helper/IsoBmff');

var _IsoBmff2 = _interopRequireDefault(_IsoBmff);

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('File', function () {
  var IsoBmff = _src2.default.IsoBmff,
      topLevelElement = _IsoBmff2.default.element,
      value = _IsoBmff2.default.buffer;

  it('generates a binary data from KontainerElements', function () {
    var buffer = undefined,
        elem = undefined,
        array = undefined;

    buffer = _src2.default.renderToBuffer(IsoBmff.createElement('file', null, IsoBmff.createElement('moov', null, IsoBmff.createElement('mvhd'))));
    expect(buffer).toBe(null);

    buffer = _src2.default.renderToBuffer(topLevelElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(topLevelElement, elem)).toBe(true);
  });

  it('parses a binary data into KontainerElements', function () {
    var b = undefined,
        elem = undefined,
        buf = undefined,
        array = undefined;

    if (global.Buffer) {
      b = new global.Buffer(value);
    } else {
      buf = new Uint8Array(value);
      b = buf.buffer;
    }
    elem = IsoBmff.createElementFromBuffer(b);
    expect(elem).not.toBe(null);
    buf = _src2.default.renderToBuffer(elem);
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