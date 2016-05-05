import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class SampleDescriptionBox extends FullBox {
  constructor(props) {
    super(SampleDescriptionBox.COMPACT_NAME, props, 0, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- SampleDescriptionBox.serialize enter.');
    const props = this.props;
    const entryCount = props.entryCount;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(entryCount, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- SampleDescriptionBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
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
  mandatoryList: []
};
