import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('CuePoint', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        187, 184, // EBML-id [BB], size=56 [B8]
        179, 134, 6, 140, 97, 113, 64, 0, // EBML-id [B3], size=6 [86], timestamp=2 hours (in nanosec)
        183, 150, // EBML-id [B7], size=22 [96]
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
        183, 150, // EBML-id [B7], size=22 [96]
        247, 129, 127, // EBML-id [F7], size=1 [81], trackUID=127
        241, 131, 1, 0, 0, // EBML-id [F1], size=3 [83], position=65536
        240, 130, 5, 0, // EBML-id [F0], size=2 [82], offset=1280 [05][00]
        178, 132, 1, 247, 138, 64, // EBML-id [B2], size=4 [84], duration=33ms [01][F7][8A][40]
        83, 120, 129, 3, // EBML-id [53][78], size=1 [83], num=3
      ];

  it('should parse/serialize the CuePoint element', () => {
    const element1 = <CuePoint>
      <CueTime value={7200000000000} />
      <CueTrackPositions>
        <CueTrack value={127} />
        <CueClusterPosition value={65536} />
        <CueRelativePosition value={1280} />
        <CueDuration value={33000000} />
        <CueBlockNumber value={3} />
      </CueTrackPositions>
      <CueTrackPositions>
        <CueTrack value={127} />
        <CueClusterPosition value={65536} />
        <CueRelativePosition value={1280} />
        <CueDuration value={33000000} />
        <CueBlockNumber value={3} />
      </CueTrackPositions>
    </CuePoint>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
