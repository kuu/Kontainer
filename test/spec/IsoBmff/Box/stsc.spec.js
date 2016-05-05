import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('SampleToChunkBox', () => {
  const value1 = [
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

  it('supports zero entry', () => {
    const stscElement = <stsc />;
    const buffer = Kontainer.render(stscElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stscElement).toHaveTheSameProps(element);
  });

  it('supports variable size', () => {
    const stscElement = <stsc {...{
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
    }} />;
    const buffer = Kontainer.render(stscElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(stscElement).toHaveTheSameProps(element);
  });
});
