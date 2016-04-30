import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('ContentEncryption', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
      ];

  it('should parse/serialize the ContentEncryption element', () => {
    const element1 = <ContentEncryption>
      <ContentEncAlgo kind="AES" />
      <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
      <ContentEncAESSettings>
        <AESSettingsCipherMode kind={'CTR'} />
      </ContentEncAESSettings>
    </ContentEncryption>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    /*
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    */
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
