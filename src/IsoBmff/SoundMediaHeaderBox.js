var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer');

class SoundMediaHeaderBox extends FullBox {
  constructor(props) {
    super(SoundMediaHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    var props = this.props,
        balance = props.balance,
        base = offset + FullBox.HEADER_LENGTH;

    base += Writer.writeFixedNumber(balance, buffer, base, 2);
    base += Writer.writeNumber(0, buffer, base, 2);

    this.size = base - offset;

    super.serialize(buffer, offset);

    return this.size;
  }
}

SoundMediaHeaderBox.COMPACT_NAME = 'smhd';

SoundMediaHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  balance: PropTypes.number
};

SoundMediaHeaderBox.defaultProps = {
  version: 0,
  balance: 0
};

SoundMediaHeaderBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = SoundMediaHeaderBox;
