var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class SyncSampleBox extends FullBox {
  constructor(props) {
    super(SyncSampleBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- SyncSampleBox.serialize enter.');
    var props = this.props,
        entries = props.entries,
        entryCount = entries.length,
        base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    for (var i = 0; i < entryCount; i++) {
      base += Writer.writeNumber(entries[i], buffer, base, 4);
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- SyncSampleBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset, readBytesNum, props,
        entryCount, sampleNumber, entries = [];

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, entryCount] = Reader.readNumber(buffer, base, 4);
    base += readBytesNum;

    for (var i = 0; i < entryCount; i++) {
      [readBytesNum, sampleNumber] = Reader.readNumber(buffer, base, 4);
      base += readBytesNum;
      entries.push(sampleNumber);
    }

    props.entries = entries;

    return [base - offset, props];
  }
}

SyncSampleBox.COMPACT_NAME = 'stss';

SyncSampleBox.propTypes = {
  version: PropTypes.number,
  entries: PropTypes.arrayOf(
    PropTypes.number
  ).isRequired
};

SyncSampleBox.defaultProps = {
  version: 0
};

SyncSampleBox.spec = {
  container: 'stbl',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = SyncSampleBox;
