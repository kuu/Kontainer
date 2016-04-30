import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('SamplingFrequency', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        181, 136, 0, 0, 172, 68, 0, 0, 0, 0, // EBML-id [B5], size=8 [88], samplingRate=44.1kHz
      ];

  it('should parse/serialize the SamplingFrequency element', () => {
    const element1 = <SamplingFrequency value={44100} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
