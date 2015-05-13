var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class MovieFragmentHeaderBox extends FullBox {
  constructor(props) {
    super(MovieFragmentHeaderBox.COMPACT_NAME, props, 0, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MovieFragmentHeaderBox.serialize enter.');
    var props = this.props,
        sequenceNumber = props.sequenceNumber,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(sequenceNumber, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MovieFragmentHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset, readBytesNum, props,
        sequenceNumber;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, sequenceNumber] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.sequenceNumber = sequenceNumber;

    return [base - offset, props];
  }
}

MovieFragmentHeaderBox.COMPACT_NAME = 'mfhd';

MovieFragmentHeaderBox.propTypes = {
  sequenceNumber: PropTypes.number.isRequired
};

MovieFragmentHeaderBox.spec = {
  container: 'moof',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = MovieFragmentHeaderBox;
