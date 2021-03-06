import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('MP4AudioSampleEntry', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });
  
  const value1 = [
        0, 0, 0, 36, // size=36
        109, 112, 52, 97, // type='mp4a'
        0, 0, 0, 0, // reserved (8)[6]
        0, 0, 0, 1, // data_reference_index=1
        0, 0, 0, 0, // reserved(32)[2]
        0, 0, 0, 0,
        0, 1, 0, 16, // channel_count=1, sample_size=16
        0, 0, 0, 0, // reserved(32)
        172, 68, 0, 0 // sample_rate=44.1kHz
      ],
      value2 = [
        0, 0, 0, 36, // size=36
        109, 112, 52, 97, // type='mp4a'
        0, 0, 0, 0, // reserved (8)[6]
        0, 0, 0, 2, // data_reference_index=2
        0, 0, 0, 0, // reserved(32)[2]
        0, 0, 0, 0,
        0, 2, 0, 24, // channel_count=2, sample_size=24
        0, 0, 0, 0, // reserved(32)
        187, 128, 0, 0 // sample_rate=48kHz
      ];

  it('supports mono/16bit/48kHz', () => {
    const mp4aElement = <mp4a dataReferenceIndex={1} />;
    const buffer = Kontainer.render(mp4aElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(mp4aElement).toHaveTheSameProps(element);
  });

  it('supports stereo/24bit/48kHz', () => {
    const mp4aElement = <mp4a {...{dataReferenceIndex: 2, channelCount: 2, sampleSize: 24, sampleRate: 48000 }} />;
    const buffer = Kontainer.render(mp4aElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(mp4aElement).toHaveTheSameProps(element);
  });
});
