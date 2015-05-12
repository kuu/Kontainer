var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class MovieExtendsHeaderBox extends FullBox {
  constructor(props) {
    super(MovieExtendsHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MovieExtendsHeaderBox.serialize enter.');
    var props = this.props,
        byteLength = props.version ? 8 : 4,
        fragmentDuration = props.fragmentDuration,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(fragmentDuration, buffer, base, byteLength);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MovieExtendsHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props, byteLength,
        fragmentDuration;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    byteLength = props.version ? 8 : 4;

    [readBytesNum, fragmentDuration] = Reader.readNumber(buffer, base, byteLength);
    base += readBytesNum;

    props.fragmentDuration = fragmentDuration;

    return [base - offset, props];
  }
}

MovieExtendsHeaderBox.COMPACT_NAME = 'mehd';

MovieExtendsHeaderBox.propTypes = {
  version: PropTypes.oneOf([0, 1]),
  fragmentDuration: PropTypes.number.isRequired
};

MovieExtendsHeaderBox.defaultProps = {
  version: 0
};

MovieExtendsHeaderBox.spec = {
  container: 'mvex',
  quantity: Box.QUANTITY_EXACTLY_ONE, // Actually zero or one.
  mandatoryBoxList: []
};

module.exports = MovieExtendsHeaderBox;
