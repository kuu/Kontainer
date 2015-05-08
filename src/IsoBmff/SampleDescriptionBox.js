var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class SampleDescriptionBox extends FullBox {
  constructor(props) {
    super(SampleDescriptionBox.COMPACT_NAME, props, 0, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- SampleDescriptionBox.serialize enter.');
    var props = this.props,
        entryCount = props.entryCount,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- SampleDescriptionBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        entryCount;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    props.entryCount = entryCount;

    return [base - offset, props];
  }
}

SampleDescriptionBox.COMPACT_NAME = 'stsd';

SampleDescriptionBox.propTypes = {
  entryCount: PropTypes.number.isRequired
};

SampleDescriptionBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = SampleDescriptionBox;
