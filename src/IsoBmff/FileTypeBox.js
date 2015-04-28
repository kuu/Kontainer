var Box = require('./Box');

function FileTypeBox() {
  Box('ftyp');
  this.majorBrand = ''; // unsigned int(32)
  this.minorVersion = 0; // unsigned int(32)
  this.compatibleBrands = []; // unsigned int(32) []
}

FileTypeBox.verify = function (instance) {
  var majorBrand = instance.majorBrand,
      minorVersion = instance.minorVersion,
      compatibleBrands = instance.compatibleBrands,
      brand;

  if (typeof majorBrand !== 'string' || majorBrand.length !== 4) {
    return false;
  }
  if (typeof minorVersion !== 'number' || minorVersion < 0 || minorVersion >= (1 << 32)) {
    return false;
  }
  for (var i = 0, il = compatibleBrands.length; i < il; i++) {
    brand = compatibleBrands[i];
    if (typeof brand !== 'string' || brand.length !== 4) {
      return false;
    }
  }
  return true;
};

FileTypeBox.serialize = function (buffer, offset, instance) {
  Box.serialize(buffer, offset, instance);
};

Box.register('ftyp', FileTypeBox);

module.exports = FileTypeBox;
