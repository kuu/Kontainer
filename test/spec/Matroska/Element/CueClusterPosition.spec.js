import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CueClusterPosition', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
      ];

  it('should parse/serialize the CueClusterPosition element', () => {
    const element1 = <CueClusterPosition value={65536} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
