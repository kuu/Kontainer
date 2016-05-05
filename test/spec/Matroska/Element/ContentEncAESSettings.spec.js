import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ContentEncAESSettings', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
      ];

  it('should parse/serialize the ContentEncAESSettings element', () => {
    const element1 = <ContentEncAESSettings>
      <AESSettingsCipherMode kind={'CTR'} />
    </ContentEncAESSettings>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
