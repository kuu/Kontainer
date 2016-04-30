import Box from './Box';
import VisualSampleEntry from './VisualSampleEntry';
import PropTypes from '../../core/PropTypes';

export default class AVCSampleEntry extends VisualSampleEntry {
  constructor(props) {
    super(AVCSampleEntry.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- AVCSampleEntry.serialize enter.');
    let base = offset;

    base += super.serialize(buffer, base);
    super.setSize(base - offset, buffer, offset);

    //console.log(`--- AVCSampleEntry.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
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
  mandatoryList: []
};
