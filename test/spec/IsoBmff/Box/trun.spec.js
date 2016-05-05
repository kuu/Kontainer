import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('TrackRunBox', () => {
  const value1 = [
        0, 0, 0, 24, // size=24
        116, 114, 117, 110, // type='trun'
        0, 0, 0, 5, // version=0, flags=data-offset-present|first-sample-flags-present
        0, 0, 0, 0, // sample-count=0
        0, 0, 0, 1, // data-offset=1
        255, 255, 250, 128 // first-sample-flags={I-pic,disposable,no-redundant,7,true,65535}
      ],
      value2 = [
        0, 0, 0, 48, // size=48
        116, 114, 117, 110, // type='trun'
        0, 0, 15, 0, // version=0, flags=sample-duration-present|sample-size-present|sample-flags-present|sample-composition-time-offset-present
        0, 0, 0, 2, // sample-count=2
        0, 0, 0, 0, // sample-duration=0
        0, 0, 0, 0, // sample-size=0
        0, 0, 0, 0,// sample-flags={unknown,unknown,unknown,0,false,0}
        0, 0, 0, 0, // sample-composition-time-offset=0
        255, 255, 255, 255, // sample-duration=0xFFFFFFFF
        255, 255, 255, 255, // sample-size=0xFFFFFFFF
        255, 255, 250, 128, // sample-flags={I-pic,disposable,no-redundant,7,true,65535}
        255, 255, 255, 255 // sample-composition-time-offset=0xFFFFFFFF
      ];

  it('supports some sets of optional values', () => {
    const trunElement = <trun {...{
      dataOffset: 1,
      firstSampleFlags: {
        sampleDependsOn: 'I-picture',
        sampleIsDependedOn: 'disposable',
        sampleHasRedundancy: 'no-redundant',
        samplePaddingValue: 7,
        sampleIsDifferenceSample: true,
        sampleDegradationPriority: 65535
      }
    }} />;
    const buffer = Kontainer.render(trunElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(trunElement).toHaveTheSameProps(element);
  });

  it('supports other sets of optional values', () => {
    const trunElement = <trun {...{
      samples: [
        {
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
        },
        {
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
        }
      ]
    }} />;
    const buffer = Kontainer.render(trunElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(trunElement).toHaveTheSameProps(element);
  });
});
