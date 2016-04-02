import Kontainer from '../../../src/';

describe('MediaDataBox', function () {
  var IsoBmff = Kontainer.IsoBmff,
      mdatValue = [
        0, 0, 0, 16, // size=16
        109, 100, 97, 116, // type='mdat'
        1, 2, 4, 8,
        16, 32, 64, 128
      ];

  it('can wrrap raw bytes', function () {
    var data = new Buffer(8);
    for (let i = 0; i < 8; i++) {
      data[i] = (1 << i);
    }
    var buffer = Kontainer.renderToBuffer(IsoBmff.createElement('mdat', {data}));
    expect(buffer).not.toBe(null);
    var array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(mdatValue.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(mdatValue[i]);
    }
  });
});
