import Box from './Box';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';
import Buffer from '../../core/Buffer';

export default class AVCConfigurationBox extends Box {
  constructor(props) {
    super(AVCConfigurationBox.COMPACT_NAME, props);
  }

  static encodeProfile(profile) {
    let p = 0;
    if (profile === 'baseline') {
      p = 66;
    } else if (profile === 'main') {
      p = 77;
    } else if (profile === 'extended') {
      p = 88;
    } else if (profile === 'high') {
      p = 100;
    }
    return p;
  }

  static decodeProfile(p) {
    let profile = '';
    if (p === 66) {
      profile = 'baseline';
    } else if (p === 77) {
      profile = 'main';
    } else if (p === 88) {
      profile = 'extended';
    } else if (p === 100) {
      profile = 'high';
    } else {
      console.error(`IsoBmff.AVConfigurationBox.parse: Unknown profile - ${p}`);
    }
    return profile;
  }

  static encodeCompatibility(compat) {
    let c = 0;
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
    const compat = {
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
    const props = this.props;
    const configurationVersion = props.configurationVersion;
    const avcProfileIndication = props.avcProfileIndication;
    const profileCompatibility = props.profileCompatibility;
    const avcLevelIndication = props.avcLevelIndication;
    const lengthSizeMinusOne = props.lengthSize - 1;
    const sequenceParameterSets = props.sequenceParameterSets;
    const pictureParameterSets = props.pictureParameterSets;

    let i, length, data, base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(configurationVersion, buffer, base, 1);
    base += Writer.writeNumber(AVCConfigurationBox.encodeProfile(avcProfileIndication), buffer, base, 1);
    base += Writer.writeNumber(AVCConfigurationBox.encodeCompatibility(profileCompatibility), buffer, base, 1);
    base += Writer.writeNumber(avcLevelIndication * 10 | 0, buffer, base, 1);
    base += Writer.writeNumber(0xFC | lengthSizeMinusOne, buffer, base, 1);
    base += Writer.writeNumber(0xE0 | sequenceParameterSets.length, buffer, base, 1);
    sequenceParameterSets.forEach(sps => {
      length = sps.length;
      data = sps.data;
      base += Writer.writeNumber(length, buffer, base, 2);
      if (buffer) {
        for (i = 0; i < length; i++) {
          buffer[base++] = data[i];
        }
      } else {
        base += length;
      }
    });
    base += Writer.writeNumber(pictureParameterSets.length, buffer, base, 1);
    pictureParameterSets.forEach(pps => {
      length = pps.length;
      data = pps.data;
      base += Writer.writeNumber(length, buffer, base, 2);
      if (buffer) {
        for (i = 0; i < length; i++) {
          buffer[base++] = data[i];
        }
      } else {
        base += length;
      }
    });

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- AVCConfigurationBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props, i, j, length, data, buf,
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
      [readBytesNum, length] = Reader.readNumber(buffer, base, 2);
      base += readBytesNum;

      Reader.ASSERT(buffer, base, length);
      buf = new Buffer(length);
      data = buf.getView();
      for (j = 0; j < length; j++) {
        data[j] = buffer[base++];
      }
      sequenceParameterSets.push({length: length, data: buf.getView()});
    }

    [readBytesNum, numOfParameterSets] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    for (i = 0; i < numOfParameterSets; i++) {
      [readBytesNum, length] = Reader.readNumber(buffer, base, 2);
      base += readBytesNum;

      Reader.ASSERT(buffer, base, length);
      buf = new Buffer(length);
      data = buf.getView();
      for (j = 0; j < length; j++) {
        data[j] = buffer[base++];
      }
      pictureParameterSets.push({length: length, data: buf.getView()});
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
  avcProfileIndication: PropTypes.oneOf(['baseline', 'main', 'extended', 'high']).isRequired,
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
  mandatoryList: []
};
