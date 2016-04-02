'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('TrackFragmentBaseMediaDecodeTimeBox', function () {
  var IsoBmff = _src2.default.IsoBmff,
      tfdtValue = [0, 0, 0, 16, // size=16
  116, 102, 100, 116, // type='tfdt'
  0, 0, 0, 0, // version=0, flags=0
  0, 1, 0, 0 // baseMediaDecodeTime=65536
  ];

  it('provides the decode time of the first sample in the track fragment', function () {
    var element = IsoBmff.createElement('tfdt', { baseMediaDecodeTime: 65536 });
    var buffer = _src2.default.renderToBuffer(element);
    expect(buffer).not.toBe(null);
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(tfdtValue.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(tfdtValue[i]);
      //console.log('a[' + i + ']=' + array[i] + ', b[' + i + ']=' + tfdtValue[i]);
    }
    var element2 = IsoBmff.createElementFromBuffer(buffer);
    expect(_matcher2.default.toHaveTheSamePropsAs(element, element2)).toBe(true);
  });
});