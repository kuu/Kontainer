var Box = require('./Box'),
    FullBox = require('./FullBox'),
    PropTypes = require('../core/PropTypes'),
    Buffer = require('../core/Buffer');

class ESDBox extends FullBox {
  constructor(props) {
    super(ESDBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- ESDBox.serialize enter.');
    var props = this.props,
        esDescriptor = props.esDescriptor,
        base = offset;

    base += super.serialize(buffer, base);
    for (var i = 0, il = esDescriptor.length; i < il; i++) {
      buffer[base++] = esDescriptor[i];
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- ESDBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset, readBytesNum, props,
        toBeRead, esDescriptor, buf;

    [readBytesNum, props] = FullBox.parse(buffer, base);
    base += readBytesNum;
    toBeRead = props.size - readBytesNum;
    buf = new Buffer(toBeRead);
    esDescriptor = buf.getView();

    for (var i = 0; i < toBeRead; i++) {
      esDescriptor[i] = buffer[base++];
    }
    props.esDescriptor = buf.getData();
    return [base - offset, props];
  }
}

ESDBox.COMPACT_NAME = 'esds';

ESDBox.propTypes = {
  version: PropTypes.number,
  esDescriptor: PropTypes.any.isRequired
};

ESDBox.defaultProps = {
  version: 0
};

ESDBox.spec = {
  container: ['mp4v', 'mp4a', 'mp4s'],
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: []
};

module.exports = ESDBox;
