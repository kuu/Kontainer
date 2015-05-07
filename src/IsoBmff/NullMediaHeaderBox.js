var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes');

class NullMediaHeaderBox extends FullBox {
  constructor(props) {
    super(NullMediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    var base = offset;

    base += super.serialize(buffer, base);
    super.setSize(base - offset, buffer, offset);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var readBytesNum, props;
    [readBytesNum, props] = FullBox.parse(buffer, offset);
    return [readBytesNum, props];
  }
}

NullMediaHeaderBox.COMPACT_NAME = 'nmhd';

NullMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1])
};

NullMediaHeaderBox.defaultProps = {
  version: 0
};

NullMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = NullMediaHeaderBox;
