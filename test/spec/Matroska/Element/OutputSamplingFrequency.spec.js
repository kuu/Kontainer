import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('OutputSamplingFrequency', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        120, 181, 136, 0, 0, 125, 0, 0, 0, 0, 0, // EBML-id [78][B5], size=8 [88], samplingRate=32kHz
      ];

  it('should parse/serialize the OutputSamplingFrequency element', () => {
    const element1 = <OutputSamplingFrequency value={32000} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
