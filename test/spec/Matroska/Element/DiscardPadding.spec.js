import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('DiscardPadding', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        117, 162, 131, 255, 0, 0, // EBML-id [75][A2], size=1 [83], padding=-65536 [FF][00][00]
      ];

  it('should parse/serialize the DiscardPadding element', () => {
    const element1 = <DiscardPadding value={-65536} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
