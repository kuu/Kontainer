import customMatchers from '../../helper/matcher';

/*global describe, it, expect, beforeEach */
describe('SampleToChunkBox', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
      value1 = [
        0, 0, 0, 16, // size=16
        115, 116, 115, 99, // type='stsc'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 0 // entry_count=0
      ],
      value2 = [
        0, 0, 0, 52, // size=52
        115, 116, 115, 99, // type='stsc'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 3, // entry_count=3
        0, 0, 0, 1, // first_chunk=1
        0, 0, 0, 10, // samples_per_chunk=10
        0, 0, 0, 1, // sample_description_index=1
        0, 0, 0, 101, // first_chunk=101
        0, 0, 0, 5, // samples_per_chunk=5
        0, 0, 0, 2, // sample_description_index=2
        0, 0, 0, 201, // first_chunk=201
        0, 0, 0, 2, // samples_per_chunk=2
        0, 0, 0, 3 // sample_description_index=3
      ];

  beforeEach(function() {
    this.addMatchers(customMatchers);
  });

  it('supports zero entry', function () {
    var stscElement = IsoBmff.createElement('stsc');
    var buffer = Kontainer.renderToArrayBuffer(stscElement);
    expect(buffer).not.toBe(null);
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(value1.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value1[i]);
    }
    var element = IsoBmff.createElementFromArrayBuffer(buffer);
    expect(element).not.toBe(null);
    expect(element).toHaveTheSamePropsAs(stscElement);
  });

  it('supports variable size', function () {
    var stscElement = IsoBmff.createElement(
      'stsc',
      {
        entries: [
          {
            firstChunk: 1,
            samplesPerChunk: 10,
            sampleDescriptionIndex: 1
          },
          {
            firstChunk: 101,
            samplesPerChunk: 5,
            sampleDescriptionIndex: 2
          },
          {
            firstChunk: 201,
            samplesPerChunk: 2,
            sampleDescriptionIndex: 3
          }
        ]
      }
    );
    var buffer = Kontainer.renderToArrayBuffer(stscElement);
    expect(buffer).not.toBe(null);
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(value2.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value2[i]);
    }
    var element = IsoBmff.createElementFromArrayBuffer(buffer);
    expect(element).not.toBe(null);
    expect(element).toHaveTheSamePropsAs(stscElement);
  });
});
