var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer');

class FileTypeBox extends Box {
  constructor(props) {
    super(FileTypeBox.COMPACT_NAME, props);
    // Validate props.
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

FileTypeBox.COMPACT_NAME = 'ftyp';

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

FileTypeBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = FileTypeBox;
