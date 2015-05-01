describe('FileTypeBox', function () {
  var Kontainer = require('../../../src/'),
      IsoBmff = Kontainer.IsoBmff,
      defaultValue = [
        0, 0, 0, 16, // size=16
        102, 116, 121, 112, // type='ftyp'
        105, 115, 111, 109, // major_brand='isom'
        0, 0, 0, 0 // minor_version=0
      ];

  it('can be initialized with the default values', function () {
    var buffer = Kontainer.renderToArrayBuffer(IsoBmff.createElement('ftyp'));
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(defaultValue.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(defaultValue[i]);
    }
  });
});
