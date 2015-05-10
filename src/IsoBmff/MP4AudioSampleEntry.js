var Box = require('./Box'),
    AudioSampleEntry = require('./AudioSampleEntry'),
    PropTypes = require('../core/PropTypes');

class MP4AudioSampleEntry extends AudioSampleEntry {
  constructor(props) {
    super(MP4AudioSampleEntry.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MP4AudioSampleEntry.serialize enter.');
    var base = offset;

    base += super.serialize(buffer, base);
    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MP4AudioSampleEntry.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props;

    [readBytesNum, props] = AudioSampleEntry.parse(buffer, base);
    base += readBytesNum;

    return [base - offset, props];
  }
}

MP4AudioSampleEntry.COMPACT_NAME = 'mp4a';

MP4AudioSampleEntry.propTypes = {
  dataReferenceIndex: PropTypes.number.isRequired,
  channelCount: PropTypes.oneOf([1, 2]),
  sampleSize: PropTypes.number,
  sampleRate: PropTypes.number
};

MP4AudioSampleEntry.defaultProps = {
  channelCount: 1, // mono
  sampleSize: 16,
  sampleRate: 44100
};

MP4AudioSampleEntry.spec = {
  container: 'stsd',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = MP4AudioSampleEntry;
