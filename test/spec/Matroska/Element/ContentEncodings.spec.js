import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('ContentEncodings', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        109, 128, 202, // EBML-id [6D][80], size=74 [CA]
        98, 64, 162, // EBML-id [62][40], size=34 [A2]
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
        98, 64, 162, // EBML-id [62][40], size=34 [A2]
        80, 49, 129, 0, // EBML-id [50][31], size=1 [81], order=0
        80, 50, 129, 3, // EBML-id [50][32], size=1 [81], encrypted=(frame|private)
        80, 51, 129, 1, // EBML-id [50][33], size=1 [81], type=encryption [1]
        80, 53, 147, // EBML-id [50][35], size=19 [93]
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
        71, 231, 132, // EBML-id [47][E7], size=4 [84]
        71, 232, 129, 1, // EBML-id [47][E8], size=1 [81], cipher mode=CTR
      ];

  it('should parse/serialize the ContentEncoding element', () => {
    const element1 = <ContentEncodings>
      <ContentEncoding>
        <ContentEncodingOrder value={0} />
        <ContentEncodingScope kind={['frame', 'private']} />
        <ContentEncodingType kind="encryption" />
        <ContentEncryption>
          <ContentEncAlgo kind="AES" />
          <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          <ContentEncAESSettings>
            <AESSettingsCipherMode kind={'CTR'} />
          </ContentEncAESSettings>
        </ContentEncryption>
      </ContentEncoding>
      <ContentEncoding>
        <ContentEncodingOrder value={0} />
        <ContentEncodingScope kind={['frame', 'private']} />
        <ContentEncodingType kind="encryption" />
        <ContentEncryption>
          <ContentEncAlgo kind="AES" />
          <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          <ContentEncAESSettings>
            <AESSettingsCipherMode kind={'CTR'} />
          </ContentEncAESSettings>
        </ContentEncryption>
      </ContentEncoding>
    </ContentEncodings>;
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
