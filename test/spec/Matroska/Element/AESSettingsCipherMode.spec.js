import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('AESSettingsCipherMode', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
      ];

  it('should parse/serialize the AESSettingsCipherMode element', () => {
    const element1 = <AESSettingsCipherMode kind={'CTR'} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
