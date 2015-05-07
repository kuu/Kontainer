var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class VideoMediaHeaderBox extends FullBox {
  constructor(props) {
    super(VideoMediaHeaderBox.COMPACT_NAME, props, props.version, 1);
  }

  validate(context) {
    var trackType = context.currentTrackType;
    if (trackType && trackType !== 'video') {
      return new Error(`"${VideoMediaHeaderBox.COMPACT_NAME}" box cannot be placed within ${trackType} track.`);
    }
    return null;
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        graphicsMode = props.graphicsMode,
        opColor = props.opColor,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeNumber(graphicsMode, buffer, base, 2);
    base += Writer.writeNumber(opColor.r, buffer, base, 2);
    base += Writer.writeNumber(opColor.g, buffer, base, 2);
    base += Writer.writeNumber(opColor.b, buffer, base, 2);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        graphicsMode, r, g, b;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, graphicsMode] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, r] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, g] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, b] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    props.graphicMode = graphicsMode;
    props.opColor = {r: r, g: g, b: b};

    return [base - offset, props];
  }
}

VideoMediaHeaderBox.COMPACT_NAME = 'vmhd';

VideoMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  graphicsMode: PropTypes.oneOf(['copy']),
  opColor: PropTypes.shape({
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number
  })
};

VideoMediaHeaderBox.defaultProps = {
  version: 0,
  graphicsMode: 'copy',
  opColor: {r: 0, g: 0, b: 0}
};

VideoMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = VideoMediaHeaderBox;
