import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class MediaHeaderBox extends FullBox {
  constructor(props) {
    super(MediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MediaHeaderBox.serialize enter.');
    const props = this.props;
    const version = props.version;
    const creationTime = props.creationTime || new Date();
    const modificationTime = props.modificationTime || new Date();
    const timeScale = props.timeScale | 0;
    const duration = props.duration | 0;
    const language = props.language;
    const byteLength = version ? 8 : 4;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(FullBox.date2sec(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.date2sec(modificationTime), buffer, base, byteLength);
    base += Writer.writeNumber(timeScale, buffer, base, 4);
    base += Writer.writeNumber(duration, buffer, base, byteLength);
    base += Writer.writeIso639Lang(language, buffer, base);
    base += Writer.writeNumber(0, buffer, base, 2);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MediaHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props, byteLength,
        creationTime, modificationTime,
        timeScale, duration, language;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;
    byteLength = props.version ? 8 : 4;

    [readBytesNum, creationTime] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, modificationTime] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, timeScale] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, duration] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    [readBytesNum, language] = Reader.readIso639Lang(buffer, base);
    base += readBytesNum;

    base += 2; // skip reserved

    props.creationTime = FullBox.sec2date(creationTime);
    props.modificationTime = FullBox.sec2date(modificationTime);
    props.timeScale = timeScale;
    props.duration = duration;
    props.language = language;

    return [base - offset, props];
  }
}

MediaHeaderBox.COMPACT_NAME = 'mdhd';

MediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  creationTime: PropTypes.instanceOf(Date),
  modificationTime: PropTypes.instanceOf(Date),
  timeScale: PropTypes.number.isRequired,
  duration: PropTypes.number,
  language: PropTypes.string
};

MediaHeaderBox.defaultProps = {
  version: 0,
  creationTime: null,
  modificationTime: null,
  duration: 0xFFFFFFFF,
  language: 'eng'
};

MediaHeaderBox.spec = {
  container: 'mdia',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
