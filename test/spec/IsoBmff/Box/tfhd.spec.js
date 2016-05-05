import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('TrackFragmentHeaderBox', () => {
  const value1 = [
        0, 0, 0, 24, // size=24
        116, 102, 104, 100, // type='tfhd'
        0, 1, 0, 18, // version=0, flags=sample-description-index-present|default-sample-size-present|duration-is-empty
        0, 0, 0, 1, // track_ID=1
        0, 0, 0, 2, // default_sample_description_index=2
        0, 1, 0, 0 // default_sample_size=65536
      ],
      value2 = [
        0, 0, 0, 32, // size=32
        116, 102, 104, 100, // type='tfhd'
        0, 0, 0, 41, // version=0, flags=base-data-offset-present|default-sample-duration-present|default-sample-flags-present
        0, 0, 0, 3, // track_ID=3
        0, 31, 255, 255, // base_data_offset=Number.MAX_SAFE_INTEGER(2^53-1)
        255, 255, 255, 255,
        0, 0, 0, 1, // default_sample_duration=1
        255, 255, 250, 128 // default_sample_flags={I-pic,disposable,no-redundant,7,true,65535}
      ];

  it('supports some sets of optional values', () => {
    const tfhdElement = <tfhd {...{
      trackId: 1,
      sampleDescriptionIndex: 2,
      defaultSampleSize: 65536,
      durationIsEmpty: true
    }} />;
    const buffer = Kontainer.render(tfhdElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(tfhdElement).toHaveTheSameProps(element);
  });

  it('supports other sets of optional values', () => {
    const tfhdElement = <tfhd {...{
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
      },
      durationIsEmpty: false
    }} />;
    const buffer = Kontainer.render(tfhdElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(tfhdElement).toHaveTheSameProps(element);
  });

  it('supports base-data-offset', () => {
    let elem1 = <tfhd {...{trackId: 1, baseDataOffset: 623}} />;
    let buffer = Kontainer.render(elem1);
    let elem2 = Kontainer.createElementFromBuffer(buffer);
    expect(elem2.props.baseDataOffset).toBe(623);
  });

});
