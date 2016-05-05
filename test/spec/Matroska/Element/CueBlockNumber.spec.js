import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CueBlockNumber', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
      ];

  it('should parse/serialize the CueBlockNumber element', () => {
    const element1 = <CueBlockNumber value={3} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
