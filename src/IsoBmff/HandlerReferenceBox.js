var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class HandlerReferenceBox extends FullBox {
  constructor(props) {
    super(HandlerReferenceBox.COMPACT_NAME, props, props.version, 0);
  }

  static encodeHandlerType(handlerType) {
    var t = 'vide';
    if (handlerType === 'video') {
      t = 'vide';
    } else if (handlerType === 'audio') {
      t = 'soun';
    } else if (handlerType === 'hint') {
      t = 'hint';
    }
    return t;
  }

  static decodeHandlerType(t) {
    var handlerType = 'video';
    if (t === 'vide') {
      handlerType = 'video';
    } else if (t === 'soun') {
      handlerType = 'audio';
    } else if (t === 'hint') {
      handlerType = 'hint';
    }
    return handlerType;
  }

  validate(context, props) {
    context.currentTrackType = HandlerReferenceBox.encodeHandlerType(props.handlerType);
    return null;
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        handlerType = HandlerReferenceBox.encodeHandlerType(props.handlerType),
        name = props.name,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeNumber(0, buffer, base, 4);
    base += Writer.writeString(handlerType, buffer, base, 4);
    base += Writer.writeNumber(0, buffer, base, 12);
    base += Writer.writeString(name, buffer, base);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props, boxEnd,
        handlerType, name;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;
    boxEnd = offset + props.size;

    base += 4; // skip reserved

    [readBytesNum, handlerType] = Reader.readString(buffer, base, 4);
    base += readBytesNum;

    base += 12; // skip reserved

    [readBytesNum, name] = Reader.readString(buffer, base, boxEnd - base);
    base += readBytesNum;

    props.handlerType = HandlerReferenceBox.decodeHandlerType(handlerType);
    props.name = name;

    return [base - offset, props];
  }
}

HandlerReferenceBox.COMPACT_NAME = 'hdlr';

HandlerReferenceBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  handlerType: PropTypes.oneOf(['vide', 'soun', 'hint']).isRequired,
  name: PropTypes.string.isRequired
};

HandlerReferenceBox.defaultProps = {
  version: 0
};

HandlerReferenceBox.spec = {
  container: ['mdia', 'meta'],
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = HandlerReferenceBox;
