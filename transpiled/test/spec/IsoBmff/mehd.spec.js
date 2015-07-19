'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helperMatcher = require('../../helper/matcher');

var _helperMatcher2 = _interopRequireDefault(_helperMatcher);

/*global describe, it, expect */
describe('MovieExtendsHeaderBox', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
      value1 = [0, 0, 0, 16, // size=16
  109, 101, 104, 100, // type='mehd'
  0, 0, 0, 0, // version=0, flags=0
  1, 0, 0, 0 // fragment_duration=16777216
  ],
      value2 = [0, 0, 0, 20, // size=20
  109, 101, 104, 100, // type='mehd'
  1, 0, 0, 0, // version=1, flags=0
  0, 0, 0, 1, // fragment_duration=4294967296
  0, 0, 0, 0];

  it('supports 32 bit duration', function () {
    var mehdElement = IsoBmff.createElement('mehd', { fragmentDuration: 16777216 });
    var buffer = Kontainer.renderToBuffer(mehdElement);
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
    expect(_helperMatcher2['default'].toHaveTheSamePropsAs(mehdElement, element)).toBe(true);
  });

  it('supports 64 bit duration', function () {
    var mehdElement = IsoBmff.createElement('mehd', { version: 1, fragmentDuration: 4294967296 });
    var buffer = Kontainer.renderToBuffer(mehdElement);
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
    expect(_helperMatcher2['default'].toHaveTheSamePropsAs(mehdElement, element)).toBe(true);
  });
});