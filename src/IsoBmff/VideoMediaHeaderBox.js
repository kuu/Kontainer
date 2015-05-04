var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer');

class VideoMediaHeaderBox extends FullBox {
  constructor(props) {
    super(VideoMediaHeaderBox.COMPACT_NAME, props, props.version, 1);
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
