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
    var props = this.props,
        configurationVersion = props.configurationVersion,
        avcProfileIndication = props.avcProfileIndication,
        profileCompatibility = props.profileCompatibility,
        avcLevelIndication = props.avcLevelIndication,
        lengthSizeMinusOne = props.lengthSize - 1,
        sequenceParameterSets = props.sequenceParameterSets,
        pictureParameterSets = props.pictureParameterSets,
        i, length, data, base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(configurationVersion, buffer, base, 1);
    base += Writer.writeNumber(AVCConfigurationBox.encodeProfile(avcProfileIndication), buffer, base, 1);
    base += Writer.writeNumber(AVCConfigurationBox.encodeCompatibility(profileCompatibility), buffer, base, 1);
    base += Writer.writeNumber(avcLevelIndication * 10 | 0, buffer, base, 1);
    base += Writer.writeNumber(0xFC | lengthSizeMinusOne, buffer, base, 1);
    base += Writer.writeNumber(0xE0 | sequenceParameterSets.length, buffer, base, 1);
    sequenceParameterSets.forEach(sps => {
      length = sps.length;
      data = new Uint8Array(sps.data);
      base += Writer.writeNumber(length, buffer, base, 2);
      for (i = 0; i < length; i++) {
        buffer[base++] = data[i];
      }
    });
    base += Writer.writeNumber(pictureParameterSets.length, buffer, base, 1);
    pictureParameterSets.forEach(pps => {
      length = pps.length;
      data = new Uint8Array(pps.data);
      base += Writer.writeNumber(length, buffer, base, 2);
      for (i = 0; i < length; i++) {
        buffer[base++] = data[i];
      }
    });

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- AVCConfigurationBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset, readBytesNum, props, i, j, length, data,
        configurationVersion, avcProfileIndication, profileCompatibility,
        avcLevelIndication, lengthSizeMinusOne,
        numOfParameterSets,
        sequenceParameterSets = [],
        pictureParameterSets = [];

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, configurationVersion] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, avcProfileIndication] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, profileCompatibility] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, avcLevelIndication] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, lengthSizeMinusOne] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, numOfParameterSets] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    numOfParameterSets &= 0x1F;

    for (i = 0; i < numOfParameterSets; i++) {
      [readBytesNum, length] = Reader.readNumber(buffer, base, 1);
      base += readBytesNum;

      data = new Uint8Array(length);
      for (j = 0; j < length; j++) {
        data[i] = buffer[base++];
      }
      sequenceParameterSets.push({length: length, data: data.buffer});
    }

    [readBytesNum, numOfParameterSets] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    for (i = 0; i < numOfParameterSets; i++) {
      [readBytesNum, length] = Reader.readNumber(buffer, base, 1);
      base += readBytesNum;

      data = new Uint8Array(length);
      for (j = 0; j < length; j++) {
        data[i] = buffer[base++];
      }
      pictureParameterSets.push({length: length, data: data.buffer});
    }

    props.configurationVersion = configurationVersion;
    props.avcProfileIndication = AVCConfigurationBox.decodeProfile(avcProfileIndication);
    props.profileCompatibility = AVCConfigurationBox.decodeCompatibility(profileCompatibility);
    props.avcLevelIndication = avcLevelIndication / 10;
    props.lengthSize = (lengthSizeMinusOne & 0x03) + 1;
    props.sequenceParameterSets = sequenceParameterSets;
    props.pictureParameterSets = pictureParameterSets;

    return [base - offset, props];
  }
}

AVCConfigurationBox.COMPACT_NAME = 'avcC';

AVCConfigurationBox.propTypes = {
  configurationVersion: PropTypes.number,
  avcProfileIndication: PropTypes.oneOf(['baseline', 'main', 'extended']).isRequired,
  profileCompatibility: PropTypes.shape({
    constraintSet0Flag: PropTypes.bool,
    constraintSet1Flag: PropTypes.bool,
    constraintSet2Flag: PropTypes.bool
  }).isRequired,
  avcLevelIndication: PropTypes.oneOf([
    1, 1.1, 1.2, 1.3,
    2, 2.1, 2.2,
    3, 3.1, 3.2,
    4, 4.1, 4.2,
    5, 5.1
  ]).isRequired,
  lengthSize: PropTypes.oneOf([1, 2, 4]).isRequired,
  sequenceParameterSets: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
      data: PropTypes.any
    })
  ),
  pictureParameterSets: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
      data: PropTypes.any
    })
  )
};

AVCConfigurationBox.defaultProps = {
  configurationVersion: 1,
  sequenceParameterSets: [],
  pictureParameterSets: []
};

AVCConfigurationBox.spec = {
  container: 'avc1',
  quantity: Box.QUANTITY_EXACTORY_ONE,
  mandatoryBoxList: []
};

module.exports = AVCConfigurationBox;
