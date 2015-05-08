var Box = require('./Box'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class AVCConfigurationBox extends Box {
  constructor(props) {
    super(AVCConfigurationBox.COMPACT_NAME, props);
  }

  static encodeProfile(profile) {
    var p = 0;
    if (profile === 'baseline') {
      p = 66;
    } else if (profile === 'main') {
      p = 77;
    } else if (profile === 'extended') {
      p = 88;
    }
    return p;
  }

  static decodeProfile(p) {
    var profile = '';
    if (p === 66) {
      profile = 'baseline';
    } else if (p === 77) {
      profile = 'main';
    } else if (p === 88) {
      profile = 'extended';
    } else {
      console.error(`IsoBmff.AVConfigurationBox.parse: Unknown profile - ${p}`);
    }
    return profile;
  }

  static encodeCompatibility(compat) {
    var c = 0;
    if (compat.constraintSet0Flag) {
      c |= 0x01;
    }
    if (compat.constraintSet1Flag) {
      c |= 0x02;
    }
    if (compat.constraintSet2Flag) {
      c |= 0x04;
    }
    return c;
  }

  static decodeCompatibility(c) {
    var compat = {
      constraintSet0Flag: false,
      constraintSet1Flag: false,
      constraintSet2Flag: false
    };
    if (c & 0x01) {
      compat.constraintSet0Flag = true;
    }
    if (c & 0x02) {
      compat.constraintSet1Flag = true;
    }
    if (c & 0x04) {
      compat.constraintSet2Flag = true;
    }
    return compat;
  }

  serialize(buffer, offset=0) {
    //console.log('--- AVCConfigurationBox.serialize enter.');
    var configurationVersion = this.configurationVersion,
        avcProfileIndication = this.avcProfileIndication,
        profileCompatibility = this.profileCompatibility,
        avcLevelIndication = this.avcLevelIndication,
        lengthSizeMinusOne = this.lengthSizeMinusOne,
        numOfSequenceParameterSets = this.numOfSequenceParameterSets,
        sequenceParameterSet = this.sequenceParameterSet,
        numOfPictureParameterSets = this.numOfPictureParameterSets,
        pictureParameterSet = this.pictureParameterSet,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(configurationVersion, buffer, base, 1);
    base += Writer.writeNumber(AVCConfigurationBox.encodeProfile(avcProfileIndication), buffer, base, 1);
    base += Writer.writeNumber(AVCConfigurationBox.encodeCompatibility(profileCompatibility), buffer, base, 1);
    compatibleBrands.forEach(brand => {
      base += Writer.writeString(brand, buffer, base, 4);
    });

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- AVCConfigurationBox.serialize exit. size=${this.size}`);
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

AVCConfigurationBox.COMPACT_NAME = 'avcC';

AVCConfigurationBox.propTypes = {
  configurationVersion: PropTypes.number,
  avcProfileIndication: PropTypes.oneOf('baseline', 'main', 'extended').isRequired,
  profileCompatibility: PropTypes.shape({
    constraintSet0Flag: PropTypes.bool,
    constraintSet1Flag: PropTypes.bool,
    constraintSet2Flag: PropTypes.bool
  }).isRequired,
  avcLevelIndication: PropTypes.oneOf(
    1, 1.1, 1.2, 1.3, '1b',
    2, 2.1, 2.2,
    3, 3.1, 3.2,
    4, 4.1, 4.2,
    5, 5.1
  ).isRequired,
  lengthSizeMinusOne: PropTypes.number.isRequired,
  numOfSequenceParameterSets: PropTypes.number,
  sequenceParameterSet: PropTypes.arrayOf(
    PropTypes.shape({
      sequenceParameterSetLength: PropTypes.number,
      sequenceParameterSetNALUnit: PropTypes.any
    })
  ),
  numOfPictureParameterSets: PropTypes.number,
  pictureParameterSet: PropTypes.arrayOf(
    PropTypes.shape({
      pictureParameterSetLength: PropTypes.number,
      pictureParameterSetNALUnit: PropTypes.any
    })
  )
 }
};

AVCConfigurationBox.defaultProps = {
  configurationVersion: 1,
  numOfSequenceParameterSets: 0,
  sequenceParameterSet: [],
  numOfPictureParameterSets: 0,
  pictureParameterSet: []
};

AVCConfigurationBox.spec = {
  container: 'stsd',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = AVCConfigurationBox;
