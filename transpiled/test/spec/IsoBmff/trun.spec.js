'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _helperMatcher = require('../../helper/matcher');

/*global describe, it, expect */

var _helperMatcher2 = _interopRequireDefault(_helperMatcher);

describe('TrackRunBox', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
      value1 = [0, 0, 0, 24, // size=24
  116, 114, 117, 110, // type='trun'
  0, 0, 0, 5, // version=0, flags=data-offset-present|first-sample-flags-present
  0, 0, 0, 0, // sample-count=0
  0, 0, 0, 1, // data-offset=1
  255, 255, 250, 128 // first-sample-flags={I-pic,disposable,no-redundant,7,true,65535}
  ],
      value2 = [0, 0, 0, 48, // size=48
  116, 114, 117, 110, // type='trun'
  0, 0, 15, 0, // version=0, flags=sample-duration-present|sample-size-present|sample-flags-present|sample-composition-time-offset-present
  0, 0, 0, 2, // sample-count=2
  0, 0, 0, 0, // sample-duration=0
  0, 0, 0, 0, // sample-size=0
  0, 0, 0, 0, // sample-flags={unknown,unknown,unknown,0,false,0}
  0, 0, 0, 0, // sample-composition-time-offset=0
  255, 255, 255, 255, // sample-duration=0xFFFFFFFF
  255, 255, 255, 255, // sample-size=0xFFFFFFFF
  255, 255, 250, 128, // sample-flags={I-pic,disposable,no-redundant,7,true,65535}
  255, 255, 255, 255 // sample-composition-time-offset=0xFFFFFFFF
  ];

  it('supports some sets of optional values', function () {
    var trunElement = IsoBmff.createElement('trun', {
      dataOffset: 1,
      firstSampleFlags: {
        sampleDependsOn: 'I-picture',
        sampleIsDependedOn: 'disposable',
        sampleHasRedundancy: 'no-redundant',
        samplePaddingValue: 7,
        sampleIsDifferenceSample: true,
        sampleDegradationPriority: 65535
      }
    });
    var buffer = Kontainer.renderToBuffer(trunElement);
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
    expect(_helperMatcher2['default'].toHaveTheSamePropsAs(trunElement, element)).toBe(true);
  });

  it('supports other sets of optional values', function () {
    var trunElement = IsoBmff.createElement('trun', {
      samples: [{
        duration: 0,
        size: 0,
        flags: {
          sampleDependsOn: 'unknown',
          sampleIsDependedOn: 'unknown',
          sampleHasRedundancy: 'unknown',
          samplePaddingValue: 0,
          sampleIsDifferenceSample: false,
          sampleDegradationPriority: 0
        },
        compositionTimeOffset: 0
      }, {
        duration: 0xFFFFFFFF,
        size: 0xFFFFFFFF,
        flags: {
          sampleDependsOn: 'I-picture',
          sampleIsDependedOn: 'disposable',
          sampleHasRedundancy: 'no-redundant',
          samplePaddingValue: 7,
          sampleIsDifferenceSample: true,
          sampleDegradationPriority: 65535
        },
        compositionTimeOffset: 0xFFFFFFFF
      }]
    });
    var buffer = Kontainer.renderToBuffer(trunElement);
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
    expect(_helperMatcher2['default'].toHaveTheSamePropsAs(trunElement, element)).toBe(true);
  });
});