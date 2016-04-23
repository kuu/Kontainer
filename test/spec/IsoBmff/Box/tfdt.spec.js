import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('TrackFragmentBaseMediaDecodeTimeBox', () => {
  const IsoBmff = Kontainer.IsoBmff,
      tfdtValue = [
        0, 0, 0, 16, // size=16
        116, 102, 100, 116, // type='tfdt'
        0, 0, 0, 0, // version=0, flags=0
        0, 1, 0, 0 // baseMediaDecodeTime=65536
      ];

  it('provides the decode time of the first sample in the track fragment', () => {
    let element = <tfdt baseMediaDecodeTime={65536} />;
    let buffer = Kontainer.renderToBuffer(element);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(tfdtValue);
    const element2 = IsoBmff.createElementFromBuffer(buffer);
    expect(element).toHaveTheSameProps(element2);
  });
});
