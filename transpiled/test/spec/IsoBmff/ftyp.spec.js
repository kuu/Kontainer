'use strict';

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('FileTypeBox', function () {
  var IsoBmff = _src2.default.IsoBmff,
      defaultValue = [0, 0, 0, 16, // size=16
  102, 116, 121, 112, // type='ftyp'
  105, 115, 111, 109, // major_brand='isom'
  0, 0, 0, 0 // minor_version=0
  ],
      avc1Value = [0, 0, 0, 24, // size=24
  102, 116, 121, 112, // type='ftyp'
  97, 118, 99, 49, // major_brand='avc1'
  0, 0, 0, 2, // minor_version=2
  105, 115, 111, 109, // compatible_brands[0]='isom'
  105, 115, 111, 50 // compatible_brands[1]='iso2'
  ];

  it('requires major_brand', function () {
    var buffer = _src2.default.renderToBuffer(IsoBmff.createElement('ftyp'));
    expect(buffer).toBe(null);
  });

  it('can be initialized with the default values', function () {
    var buffer = _src2.default.renderToBuffer(IsoBmff.createElement('ftyp', { majorBrand: 'isom' }));
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(defaultValue.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(defaultValue[i]);
    }
  });

  it('can be initialized with the specified values', function () {
    var buffer = _src2.default.renderToBuffer(IsoBmff.createElement('ftyp', { majorBrand: 'avc1', minorVersion: 2, compatibleBrands: ['isom', 'iso2'] }));
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(avc1Value.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(avc1Value[i]);
    }
  });
});