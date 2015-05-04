var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer');

class MovieHeaderBox extends FullBox {
  constructor(props) {
    super(MovieHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
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
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeNumber(FullBox.convertTime(creationTime), buffer, base, byteLength);
    base += Writer.writeNumber(FullBox.convertTime(modificationTime), buffer, base, byteLength);
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

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
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
  duration: 0,
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
