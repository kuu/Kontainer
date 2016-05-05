import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'none':
      return 0;
    case 'DES':
      return 1;
    case '3DES':
      return 2;
    case 'Twofish':
      return 3;
    case 'Blowfish':
      return 4;
    case 'AES':
      return 5;
  }
  throwException(`Unknow encryption algorithm: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 0:
      return 'none';
    case 1:
      return 'DES';
    case 2:
      return '3DES';
    case 3:
      return 'Twofish';
    case 4:
      return 'Blowfish';
    case 5:
      return 'AES';
  }
  throwException(`Unknow encryption algorithm: (${value})`);
}

export default class ContentEncAlgo extends TypeUInt {
  constructor(props) {
    super(ContentEncAlgo.ELEMENT_ID, ContentEncAlgo.COMPACT_NAME, props);
  }

  static validate(context, props) {
    context.contentEncAlgo = props.kind;
  }

  serialize(buffer, offset=0) {
    const value = this.props.kind;

    let base = offset;

    this.props.value = encodeValue(value);
    base += super.serialize(buffer, base);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props;

    [readBytesNum, props] = TypeUInt.parse(buffer, base);
    base += readBytesNum;

    props.kind = decodeValue(props.value);

    return [base - offset, props];
  }
}

ContentEncAlgo.COMPACT_NAME = 'ContentEncAlgo';

ContentEncAlgo.ELEMENT_ID = [0x47, 0xE1];

ContentEncAlgo.propTypes = {
  kind: PropTypes.oneOf(['none', 'DES', '3DES', 'Twofish', 'Blowfish', 'AES'])
};

ContentEncAlgo.defaultProps = {
  kind: 'none'
};

ContentEncAlgo.spec = {
  container: 'ContentEncryption',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
