'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('TrackExtendsBox', function () {
  var IsoBmff = _src2.default.IsoBmff,
      value1 = [0, 0, 0, 32, // size=32
  116, 114, 101, 120, // type='trex'
  0, 0, 0, 0, // version=0, flags=0
  0, 0, 0, 1, // track_ID=1
  0, 0, 0, 2, // default_sample_description_index=2
  255, 255, 255, 255, // default_sample_duration=0xFFFFFFFF
  0, 1, 0, 0, // default_sample_size=65536
  0, 0, 0, 0 // default_sample_flags={unknown,unknown,unknown,0,false,0}
  ],
      value2 = [0, 0, 0, 32, // size=32
  116, 114, 101, 120, // type='trex'
  0, 0, 0, 0, // version=0, flags=0
  0, 0, 0, 3, // track_ID=3
  0, 0, 0, 4, // default_sample_description_index=4
  0, 0, 0, 1, // default_sample_duration=1
  1, 0, 0, 0, // default_sample_size=16777216
  255, 255, 250, 128 // default_sample_flags={I-pic,disposable,no-redundant,7,true,65535}
  ];

  it('supports falthy values', function () {
    var trexElement = IsoBmff.createElement('trex', {
      trackId: 1,
      defaultSampleDescriptionIndex: 2,
      defaultSampleDuration: 0xFFFFFFFF,
      defaultSampleSize: 65536,
      defaultSampleFlags: {
        sampleDependsOn: 'unknown',
        sampleIsDependedOn: 'unknown',
        sampleHasRedundancy: 'unknown',
        samplePaddingValue: 0,
        sampleIsDifferenceSample: false,
        sampleDegradationPriority: 0
      }
    });
    var buffer = _src2.default.renderToBuffer(trexElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(trexElement, element)).toBe(true);
  });

  it('supports truethy values', function () {
    var trexElement = IsoBmff.createElement('trex', {
      trackId: 3,
      defaultSampleDescriptionIndex: 4,
      defaultSampleDuration: 1,
      defaultSampleSize: 16777216,
      defaultSampleFlags: {
        sampleDependsOn: 'I-picture',
        sampleIsDependedOn: 'disposable',
        sampleHasRedundancy: 'no-redundant',
        samplePaddingValue: 7,
        sampleIsDifferenceSample: true,
        sampleDegradationPriority: 65535
      }
    });
    var buffer = _src2.default.renderToBuffer(trexElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(trexElement, element)).toBe(true);
  });
});