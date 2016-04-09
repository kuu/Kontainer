import Box from './Box';
import FullBox from './FullBox';
import PropTypes from '../../core/PropTypes';
import Writer from '../../core/Writer';
import Reader from '../../core/Reader';

export default class MovieExtendsHeaderBox extends FullBox {
  constructor(props) {
    super(MovieExtendsHeaderBox.COMPACT_NAME, props, props.version, 0);
  }

  serialize(buffer, offset=0) {
    //console.log('--- MovieExtendsHeaderBox.serialize enter.');
    const props = this.props;
    const byteLength = props.version ? 8 : 4;
    const fragmentDuration = props.fragmentDuration;
    
    let base = offset;

    base += super.serialize(buffer, base);
    base += Writer.writeNumber(fragmentDuration, buffer, base, byteLength);

    super.setSize(base - offset, buffer, offset);

    //console.log(`--- MovieExtendsHeaderBox.serialize exit. size=${this.size}`);
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
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
