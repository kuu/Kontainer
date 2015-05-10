var Box = require('./Box'),
    PropTypes = require('../core/PropTypes');

class MediaDataBox extends Box {
  constructor(props) {
    super(MediaDataBox.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MediaDataBox.serialize enter.');
    var data = new Uint8Array(this.props.data),
        base = offset;

    base += super.serialize(buffer, base);

    for (var i = 0, il = data.length; i < il; i++) {
      buffer[base++] = data[i];
    }

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MediaDataBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset, readBytesNum, props,
        toBeRead, data;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;
    toBeRead = props.size - readBytesNum;
    data = new Uint8Array(toBeRead);

    for (var i = 0; i < toBeRead; i++) {
      data[i] = buffer[base++];
    }
    props.data = data.buffer;

    return [base - offset, props];
  }
}

MediaDataBox.COMPACT_NAME = 'mdat';

MediaDataBox.propTypes = {
  data: PropTypes.any.isRequired
};

MediaDataBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: []
};

module.exports = MediaDataBox;
