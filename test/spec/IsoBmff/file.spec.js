/*global describe, it, expect */
describe('File', function () {
  var Kontainer = require('../../../src/');

  var IsoBmff = Kontainer.IsoBmff,
      value = [
    0, 0, 0, 16, // size=16
    102, 116, 121, 112, // type='ftyp'
    105, 115, 111, 109, // major_brand='isom'
    0, 0, 0, 0, // minor_version=0
    0, 0, 0, 8, // size=8
    109, 111, 111, 118 // type='moov'
  ];

  it('requires "ftyp" and "moov" as direct children', function () {
    var buffer = Kontainer.renderToArrayBuffer(IsoBmff.createElement('file', null,
      IsoBmff.createElement('ftyp', {majorBrand: 'isom'})
    ));
    expect(buffer).toBe(null);
    buffer = Kontainer.renderToArrayBuffer(IsoBmff.createElement('file', null,
      IsoBmff.createElement('moov', null,
        IsoBmff.createElement('mvhd')
      )
    ));
    expect(buffer).toBe(null);
    buffer = Kontainer.renderToArrayBuffer(IsoBmff.createElement('file', null,
      IsoBmff.createElement('ftyp', {majorBrand: 'isom'}),
      IsoBmff.createElement('moov', null,
        IsoBmff.createElement('mvhd'),
        IsoBmff.createElement('trak')
      )
    ));
    expect(buffer).not.toBe(null);
    var array = new Uint8Array(buffer);
    expect(array.length).toBe(value.length);
    for (var i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(value[i]);
    }
  });
});
