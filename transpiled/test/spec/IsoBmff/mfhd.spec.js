'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('MovieFragmentHeaderBox', function () {
  var IsoBmff = _src2.default.IsoBmff,
      value1 = [0, 0, 0, 16, // size=16
  109, 102, 104, 100, // type='mfhd'
  0, 0, 0, 0, // version=0, flags=0
  0, 0, 0, 0 // sequence_number=0
  ],
      value2 = [0, 0, 0, 16, // size=16
  109, 102, 104, 100, // type='mfhd'
  0, 0, 0, 0, // version=0, flags=0
  255, 255, 255, 255 // sequence_number=0xFFFFFFFF
  ];

  it('supports the smallest sequence number.', function () {
    var mfhdElement = IsoBmff.createElement('mfhd', { sequenceNumber: 0 });
    var buffer = _src2.default.renderToBuffer(mfhdElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(mfhdElement, element)).toBe(true);
  });

  it('supports the largest sequence number.', function () {
    var mfhdElement = IsoBmff.createElement('mfhd', { sequenceNumber: 0xFFFFFFFF });
    var buffer = _src2.default.renderToBuffer(mfhdElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(mfhdElement, element)).toBe(true);
  });
});