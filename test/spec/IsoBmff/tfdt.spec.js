import customMatchers from '../../helper/matcher';
import Kontainer from '../../../src/';

describe('TrackFragmentBaseMediaDecodeTimeBox', () => {
  var IsoBmff = Kontainer.IsoBmff,
      tfdtValue = [
        0, 0, 0, 16, // size=16
        116, 102, 100, 116, // type='tfdt'
        0, 0, 0, 0, // version=0, flags=0
        0, 1, 0, 0 // baseMediaDecodeTime=65536
      ];

  it('provides the decode time of the first sample in the track fragment', () => {
    let element = IsoBmff.createElement('tfdt', {baseMediaDecodeTime: 65536});
    let buffer = Kontainer.renderToBuffer(element);
    expect(buffer).not.toBe(null);
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(tfdtValue.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(tfdtValue[i]);
      //console.log('a[' + i + ']=' + array[i] + ', b[' + i + ']=' + tfdtValue[i]);
    }
    var element2 = IsoBmff.createElementFromBuffer(buffer);
    expect(customMatchers.toHaveTheSamePropsAs(element, element2)).toBe(true);
  });
});
