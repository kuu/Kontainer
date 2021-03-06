import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class MovieFragmentHeaderBox extends FullBox {
  constructor(props) {
    super(MovieFragmentHeaderBox.COMPACT_NAME, props, 0, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MovieFragmentHeaderBox.serialize enter.');
    const props = this.props;
    const sequenceNumber = props.sequenceNumber;

    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(sequenceNumber, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MovieFragmentHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
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
  mandatoryList: []
};
