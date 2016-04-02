'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('TrackFragmentHeaderBox', function () {
  var IsoBmff = _src2.default.IsoBmff,
      value1 = [0, 0, 0, 24, // size=24
  116, 102, 104, 100, // type='tfhd'
  0, 1, 0, 18, // version=0, flags=sample-description-index-present|default-sample-size-present|duration-is-empty
  0, 0, 0, 1, // track_ID=1
  0, 0, 0, 2, // default_sample_description_index=2
  0, 1, 0, 0 // default_sample_size=65536
  ],
      value2 = [0, 0, 0, 32, // size=32
  116, 102, 104, 100, // type='tfhd'
  0, 0, 0, 41, // version=0, flags=base-data-offset-present|default-sample-duration-present|default-sample-flags-present
  0, 0, 0, 3, // track_ID=3
  0, 31, 255, 255, // base_data_offset=Number.MAX_SAFE_INTEGER(2^53-1)
  255, 255, 255, 255, 0, 0, 0, 1, // default_sample_duration=1
  255, 255, 250, 128 // default_sample_flags={I-pic,disposable,no-redundant,7,true,65535}
  ];

  it('supports some sets of optional values', function () {
    var tfhdElement = IsoBmff.createElement('tfhd', {
      trackId: 1,
      sampleDescriptionIndex: 2,
      defaultSampleSize: 65536,
      durationIsEmpty: true
    });
    var buffer = _src2.default.renderToBuffer(tfhdElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(tfhdElement, element)).toBe(true);
  });

  it('supports other sets of optional values', function () {
    var tfhdElement = IsoBmff.createElement('tfhd', {
      trackId: 3,
      baseDataOffset: Number.MAX_SAFE_INTEGER,
      defaultSampleDuration: 1,
      defaultSampleFlags: {
        sampleDependsOn: 'I-picture',
        sampleIsDependedOn: 'disposable',
        sampleHasRedundancy: 'no-redundant',
        samplePaddingValue: 7,
        sampleIsDifferenceSample: true,
        sampleDegradationPriority: 65535
      }
    });
    var buffer = _src2.default.renderToBuffer(tfhdElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(tfhdElement, element)).toBe(true);
  });

  it('supports base-data-offset', function () {
    var elem1 = IsoBmff.createElement('tfhd', { trackId: 1, baseDataOffset: 623 });
    var buffer = _src2.default.renderToBuffer(elem1);
    var elem2 = IsoBmff.createElementFromBuffer(buffer);
    expect(elem2.props.baseDataOffset).toBe(623);
  });
});