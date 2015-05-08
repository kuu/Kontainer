var Box = require('./Box'),
    VisualSampleEntry = require('./VisualSampleEntry'),
    AVCConfigurationBox = require('./AVCConfigurationBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class AVCSampleEntry extends VisualSampleEntry {
  constructor(props) {
    super(AVCSampleEntry.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- AVCSampleEntry.serialize enter.');
    var props = this.props,
        base = offset;

    base += super.serialize(buffer, base);
    super.setSize(base - offset, buffer, offset);

    //console.log(`--- AVCSampleEntry.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props;

    [readBytesNum, props] = VisualSampleEntry.parse(buffer, base);
    base += readBytesNum;

    return [base - offset, props];
  }
}

AVCSampleEntry.COMPACT_NAME = 'avc1';

AVCSampleEntry.propTypes = {
  dataReferenceIndex: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  horizResolution: PropTypes.number,
  vertResolution: PropTypes.number,
  frameCount: PropTypes.number,
  compressorName: PropTypes.string,
  depth: PropTypes.number
};

AVCSampleEntry.defaultProps = {
  horizResolution: 72.0,
  vertResolution: 72.0,
  frameCount: 1,
  compressorName: '',
  depth: 0x18
};

AVCSampleEntry.spec = {
  container: 'stsd',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = AVCSampleEntry;
