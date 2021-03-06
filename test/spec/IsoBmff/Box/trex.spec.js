import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('TrackExtendsBox', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });
  
  const value1 = [
        0, 0, 0, 32, // size=32
        116, 114, 101, 120, // type='trex'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 1, // track_ID=1
        0, 0, 0, 2, // default_sample_description_index=2
        255, 255, 255, 255, // default_sample_duration=0xFFFFFFFF
        0, 1, 0, 0, // default_sample_size=65536
        0, 0, 0, 0 // default_sample_flags={unknown,unknown,unknown,0,false,0}
      ],
      value2 = [
        0, 0, 0, 32, // size=32
        116, 114, 101, 120, // type='trex'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 3, // track_ID=3
        0, 0, 0, 4, // default_sample_description_index=4
        0, 0, 0, 1, // default_sample_duration=1
        1, 0, 0, 0, // default_sample_size=16777216
        255, 255, 250, 128 // default_sample_flags={I-pic,disposable,no-redundant,7,true,65535}
      ];

  it('supports falthy values', () => {
    const trexElement = <trex {...{
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
    }} />;
    const buffer = Kontainer.render(trexElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(trexElement).toHaveTheSameProps(element);
  });

  it('supports truethy values', () => {
    const trexElement = <trex {...{
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
    }} />;
    const buffer = Kontainer.render(trexElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(trexElement).toHaveTheSameProps(element);
  });
});
