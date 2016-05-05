import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('TrackEntry', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        174, 65, 26, // EBML-id [AE], size=282 [41][1A]
        215, 129, 127, // EBML-id [D7], size=1 [81], track number=127
        115, 197, 132, 255, 255, 255, 255, // EBML-id [73][C5], size=1 [84], id=[FF][FF][FF][FF]
        131, 129, 1, // EBML-id [83], size=1 [81], type=video [1]
        185, 129, 1, // EBML-id [B9], size=1 [81], enabled
        136, 129, 0, // EBML-id [88], size=1 [81], isNotDefault
        85, 170, 129, 1, // EBML-id [55][AA], size=1 [81], isForced
        156, 129, 0, // EBML-id [9C], size=1 [81], notUsingLacing
        35, 227, 131, 134, 6, 140, 97, 113, 64, 0, // EBML-id [23][E3][83], size=6 [86], duration=2 hours (in nanosec)
        83, 110, 149, 227, 130, 143, 227, 129, 159, 227, 129, 151, 227, 129, 175, 227, 129, 139, 227, 130, 130, 227, 130, 129, // EBML-id [53][6E], size=21 [95], name=”I'm a seagull" in Japanese
        34, 181, 156, 131, 106, 112, 110, // EBML-id [22][B5][9C], size=3 [83], country="jpn"
        134, 136, 65, 95, 86, 79, 82, 66, 73, 83, // EBML-id [86], size=8 [88], codec id="A_VORBIS"
        99, 162, 133, 1, 2, 3, 4, 5, // EBML-id [63][A2], size=5 [85], version=1
        37, 134, 136, 146, 227, 129, 136, 227, 129, 131, 227, 129, 161, 228, 186, 140, 229, 133, 173, 229, 155, 155, // EBML-id [25][86][88], size=18 [92], name="H.264" in Japanese
        86, 170, 131, 76, 75, 64, // EBML-id [56][AA], size=3 [83], delay=5ms
        86, 187, 132, 59, 154, 202, 0, // EBML-id [56][BB], size=4 [84], time=1sec
        224, 181, // EBML-id [E0], size=53 [B5]
        154, 129, 2, // EBML-id [9A], size=1 [81], type=progressive [2]
        83, 184, 129, 13, // EBML-id [53][B8], size=1 [81], mode=both eyes laced in one Block [0D]
        83, 192, 129, 1, // EBML-id [53][C0], size=1 [81], hasAlpha
        176, 130, 7, 128, // EBML-id [B0], size=2 [82], width=1920
        186, 130, 4, 56, // EBML-id [BA], size=2 [82], height=1080
        84, 170, 129, 80, // EBML-id [54][AA], size=1 [81], bottom=80px
        84, 187, 129, 80, // EBML-id [54][BB], size=1 [81], top=80px
        84, 204, 129, 60, // EBML-id [54][CC], size=1 [81], left=60px
        84, 221, 129, 60, // EBML-id [54][DD], size=1 [81], right=60
        84, 176, 130, 6, 224, // EBML-id [54][B0], size=2 [82], width=1760
        84, 186, 130, 3, 192, // EBML-id [54][BA], size=2 [82], height=960
        84, 178, 129, 3, // EBML-id [54][B2], size=1 [81], kind=aspectRatio
        84, 179, 129, 1, // EBML-id [54][B3], size=1 [81], kind=keep
        225, 156, // EBML-id [E1], size=28 [9C]
        181, 136, 0, 0, 172, 68, 0, 0, 0, 0, // EBML-id [B5], size=8 [88], samplingRate=44.1kHz
        120, 181, 136, 0, 0, 125, 0, 0, 0, 0, 0, // EBML-id [78][B5], size=8 [88], samplingRate=32kHz
        159, 129, 2, // EBML-id [9F], size=1 [81], channels=stereo
        98, 100, 129, 8, // EBML-id [62][64], size=1 [81], depth=8
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
    const element1 = <TrackEntry>
      <TrackNumber value={127} />
      <TrackUID value={0xffffffff} />
      <TrackType kind="video" />
      <FlagEnabled value={true} />
      <FlagDefault value={false} />
      <FlagForced value={true} />
      <FlagLacing value={false} />
      <DefaultDuration value={7200000000000} />
      <Name value={"\u308F\u305F\u3057\u306F\u304B\u3082\u3081"} />
      <Language value={"jpn"} />
      <CodecID value={"A_VORBIS"} />
      <CodecPrivate value={new Buffer([1, 2, 3, 4, 5]).getView()} />
      <CodecName value={"\u3048\u3043\u3061\u4E8C\u516D\u56DB"} />
      <CodecDelay value={5000000} />;
      <SeekPreRoll value={1000000000} />
      <Video>
        <FlagInterlaced kind="progressive" />
        <StereoMode kind="bothEyesLacedInOneBlock-LeftFirst" />
        <AlphaMode value={true} />
        <PixelWidth value={1920} />
        <PixelHeight value={1080} />
        <PixelCropBottom value={80} />
        <PixelCropTop value={80} />
        <PixelCropLeft value={60} />
        <PixelCropRight value={60} />
        <DisplayWidth value={1760} />
        <DisplayHeight value={960} />
        <DisplayUnit kind={"aspectRatio"} />
        <AspectRatioType kind={"keep"} />
      </Video>
      <Audio>
        <SamplingFrequency value={44100} />
        <OutputSamplingFrequency value={32000} />
        <Channels value={2} />
        <BitDepth value={8} />
      </Audio>
      <ContentEncodings>
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
      </ContentEncodings>
    </TrackEntry>;
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
