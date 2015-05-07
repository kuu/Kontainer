var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class FileTypeBox extends Box {
  constructor(props) {
    super(FileTypeBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- FileTypeBox.serialize enter.');
    var majorBrand = this.props.majorBrand,
        minorVersion = this.props.minorVersion,
        compatibleBrands = this.props.compatibleBrands,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeString(majorBrand, buffer, base, 4);
    base += Writer.writeNumber(minorVersion, buffer, base, 4);
    compatibleBrands.forEach(brand => {
      base += Writer.writeString(brand, buffer, base, 4);
    });

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- FileTypeBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props, boxEnd,
        majorBrand, minorVersion,
        brand, compatibleBrands;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;
    boxEnd = offset + props.size;

    [readBytesNum, majorBrand] = Reader.readString(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, minorVersion] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.majorBrand = majorBrand;
    props.minorVersion = minorVersion;
    compatibleBrands = props.compatibleBrands = [];
    while (base < boxEnd) {
      [readBytesNum, brand] = Reader.readString(buffer, base, 4);
      compatibleBrands.push(brand);
      base += readBytesNum;
    }

    return [base - offset, props];
  }
}

FileTypeBox.COMPACT_NAME = 'ftyp';

FileTypeBox.propTypes = {
  majorBrand: PropTypes.string.isRequired,
  minorVersion: PropTypes.number,
  compatibleBrands: PropTypes.arrayOf(PropTypes.string)
};

FileTypeBox.defaultProps = {
  minorVersion: 0,
  compatibleBrands: []
};

FileTypeBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = FileTypeBox;
