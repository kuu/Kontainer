'use strict';

var _matcher = require('../../helper/matcher');

var _matcher2 = _interopRequireDefault(_matcher);

var _src = require('../../../src/');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('MP4AudioSampleEntry', function () {
  var IsoBmff = _src2.default.IsoBmff,
      value1 = [0, 0, 0, 36, // size=36
  109, 112, 52, 97, // type='mp4a'
  0, 0, 0, 0, // reserved (8)[6]
  0, 0, 0, 1, // data_reference_index=1
  0, 0, 0, 0, // reserved(32)[2]
  0, 0, 0, 0, 0, 1, 0, 16, // channel_count=1, sample_size=16
  0, 0, 0, 0, // reserved(32)
  172, 68, 0, 0 // sample_rate=44.1kHz
  ],
      value2 = [0, 0, 0, 36, // size=36
  109, 112, 52, 97, // type='mp4a'
  0, 0, 0, 0, // reserved (8)[6]
  0, 0, 0, 2, // data_reference_index=2
  0, 0, 0, 0, // reserved(32)[2]
  0, 0, 0, 0, 0, 2, 0, 24, // channel_count=2, sample_size=24
  0, 0, 0, 0, // reserved(32)
  187, 128, 0, 0 // sample_rate=48kHz
  ];

  it('supports mono/16bit/48kHz', function () {
    var mp4aElement = IsoBmff.createElement('mp4a', { dataReferenceIndex: 1 });
    var buffer = _src2.default.renderToBuffer(mp4aElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(mp4aElement, element)).toBe(true);
  });

  it('supports stereo/24bit/48kHz', function () {
    var mp4aElement = IsoBmff.createElement('mp4a', { dataReferenceIndex: 2, channelCount: 2, sampleSize: 24, sampleRate: 48000 });
    var buffer = _src2.default.renderToBuffer(mp4aElement);
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
    expect(_matcher2.default.toHaveTheSamePropsAs(mp4aElement, element)).toBe(true);
  });
});