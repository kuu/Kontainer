import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Video', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
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
      ];

  it('should parse/serialize the Video element', () => {
    const element1 = <Video>
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
    </Video>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
