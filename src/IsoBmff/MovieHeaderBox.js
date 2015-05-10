var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class MovieHeaderBox extends FullBox {
  constructor(props) {
    super(MovieHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MovieHeaderBox.serialize enter.');
    var props = this.props,
        version = props.version,
        creationTime = props.creationTime || new Date(),
        modificationTime = props.modificationTime || new Date(),
        timeScale = props.timeScale | 0,
        duration = props.duration | 0,
        rate = props.rate,
        volume = props.volume,
        matrix = props.matrix,
        nextTrackId = props.nextTrackId,
        byteLength = version ? 8 : 4,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(FullBox.date2sec(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.date2sec(modificationTime), buffer, base, byteLength);
    base += Writer.writeNumber(timeScale, buffer, base, 4);
    base += Writer.writeNumber(duration, buffer, base, byteLength);
    base += Writer.writeFixedNumber(rate, buffer, base, 4);
    base += Writer.writeFixedNumber(volume, buffer, base, 2);
    base += Writer.writeNumber(0, buffer, base, 10);
    for (var i = 0; i < 9; i++) {
      base += Writer.writeFixedNumber(matrix[i], buffer, base, 4);
    }
    base += Writer.writeNumber(0, buffer, base, 24);
    base += Writer.writeNumber(nextTrackId, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MovieHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props, byteLength,
        creationTime, modificationTime,
        timeScale, duration, rate, volume,
        matrix = new Array(9), nextTrackId;

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

    [readBytesNum, rate] = Reader.readFixedNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, volume] = Reader.readFixedNumber(buffer, base, 2);
    base += readBytesNum;

    base += 10; // skip reserved

    for (var i = 0; i < 9; i++) {
      [readBytesNum, matrix[i]] = Reader.readFixedNumber(buffer, base, 4);
      base += readBytesNum;
    }
    base += 24; // skip reserved

    [readBytesNum, nextTrackId] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.creationTime = FullBox.sec2date(creationTime);
    props.modificationTime = FullBox.sec2date(modificationTime);
    props.timeScale = timeScale;
    props.duration = duration;
    props.rate = rate;
    props.volume = volume;
    props.matrix = matrix;
    props.nextTrackId = nextTrackId;

    return [base - offset, props];
  }
}

MovieHeaderBox.COMPACT_NAME = 'mvhd';

MovieHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  creationTime: PropTypes.instanceOf(Date),
  modificationTime: PropTypes.instanceOf(Date),
  timeScale: PropTypes.number.isRequired,
  duration: PropTypes.number,
  rate: PropTypes.number,
  volume: PropTypes.number,
  matrix: PropTypes.arrayOf(PropTypes.number),
  nextTrackId: PropTypes.number.isRequired
};

MovieHeaderBox.defaultProps = {
  version: 0,
  creationTime: null,
  modificationTime: null,
  duration: 0xFFFFFFFF | 0,
  rate: 1.0,
  volume: 1.0,
  matrix: [1, 0, 0, 0, 1, 0, 0, 0, 16384]
};

MovieHeaderBox.spec = {
  container: 'moov',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = MovieHeaderBox;
