import Kontainer from '../../src/';
import Buffer from '../../src/core/Buffer';

Kontainer.use('webm');

export default {
  fullAV: (
    <Tracks>
      <TrackEntry>
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
      </TrackEntry>
      <TrackEntry>
        <TrackNumber value={127} />
        <TrackUID value={0xffffffff} />
        <TrackType kind="audio" />
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
      </TrackEntry>
    </Tracks>
  ),
  audioOnly: (
    <Tracks>
      <TrackEntry>
        <TrackNumber value={127} />
        <TrackUID value={0xffffffff} />
        <TrackType kind="audio" />
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
      </TrackEntry>
    </Tracks>
  )
}
