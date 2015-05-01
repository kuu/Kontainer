var Box = require('./Box'),
    PropTypes = require('../PropTypes'),
    Writer = require('../util/Writer');

class FileTypeBox extends Box {
  constructor(props) {
    super('ftyp', props);
  }

  serialize(buffer, offset=0) {
    var majorBrand = this.props.majorBrand,
        minorVersion = this.props.minorVersion,
        compatibleBrands = this.props.compatibleBrands,
        base = offset;

    base += Box.HEADER_LENGTH;
    base += Writer.writeString(majorBrand, buffer, base, 4);
    base += Writer.writeNumber(minorVersion, buffer, base, 4);
    compatibleBrands.forEach(brand => {
      base += Writer.writeString(brand, buffer, base, 4);
    });

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }
}

FileTypeBox.propTypes = {
  majorBrand: PropTypes.string,
  minorVersion: PropTypes.number,
  compatibleBrands: PropTypes.arrayOf(PropTypes.string)
};

FileTypeBox.defaultProps = {
  majorBrand: 'isom',
  minorVersion: 0,
  compatibleBrands: []
};

module.exports = FileTypeBox;
