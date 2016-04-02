import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../core/PropTypes';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class VideoMediaHeaderBox extends FullBox {
  constructor(props) {
    super(VideoMediaHeaderBox.COMPACT_NAME, props, props.version, 1);
  }

  static validate(context) {
    const trackType = context.currentTrackType;
    if (trackType && trackType !== 'video') {
      return new Error(`"${VideoMediaHeaderBox.COMPACT_NAME}" box cannot be placed within ${trackType} track.`);
    }
    return null;
  }

  static encodeGraphicsMode(mode) {
    let m = 0;
    if (mode === 'copy') {
      m = 0;
    }
    return m;
  }

  static decodeGraphicsMode(m) {
    let mode = 'copy';
    if (m === 0) {
      mode = 'copy';
    }
    return mode;
  }
  serialize(buffer, offset=0) {
    //console.log('--- VideoMediaHeaderBox.serialize enter.');
    const props = this.props;
    const graphicsMode = VideoMediaHeaderBox.encodeGraphicsMode(props.graphicsMode);
    const opColor = props.opColor;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(graphicsMode, buffer, base, 2);
    base += Writer.writeNumber(opColor.r, buffer, base, 2);
    base += Writer.writeNumber(opColor.g, buffer, base, 2);
    base += Writer.writeNumber(opColor.b, buffer, base, 2);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- VideoMediaHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
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

    props.graphicsMode = VideoMediaHeaderBox.decodeGraphicsMode(graphicsMode);
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
