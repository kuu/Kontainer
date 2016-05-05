import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Audio', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        225, 156, // EBML-id [E1], size=28 [9C]
        181, 136, 0, 0, 172, 68, 0, 0, 0, 0, // EBML-id [B5], size=8 [88], samplingRate=44.1kHz
        120, 181, 136, 0, 0, 125, 0, 0, 0, 0, 0, // EBML-id [78][B5], size=8 [88], samplingRate=32kHz
        159, 129, 2, // EBML-id [9F], size=1 [81], channels=stereo
        98, 100, 129, 8, // EBML-id [62][64], size=1 [81], depth=8
      ];

  it('should parse/serialize the Audio element', () => {
    const element1 = <Audio>
      <SamplingFrequency value={44100} />
      <OutputSamplingFrequency value={32000} />
      <Channels value={2} />
      <BitDepth value={8} />
    </Audio>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
