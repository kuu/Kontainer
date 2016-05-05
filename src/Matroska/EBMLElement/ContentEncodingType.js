import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'compression':
      return 0;
    case 'encryption':
      return 1;
  }
  throwException(`Unknow encoding type: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 0:
      return 'compression';
    case 1:
      return 'encryption';
  }
  throwException(`Unknow encoding type: (${value})`);
}

export default class ContentEncodingType extends TypeUInt {
  constructor(props) {
    super(ContentEncodingType.ELEMENT_ID, ContentEncodingType.COMPACT_NAME, props);
  }

  static validate(context, props) {
    context.contentEncodingType = props.kind;
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

ContentEncodingType.COMPACT_NAME = 'ContentEncodingType';

ContentEncodingType.ELEMENT_ID = [0x50, 0x33];

ContentEncodingType.propTypes = {
  kind: PropTypes.oneOf(['compression', 'encryption'])
};

ContentEncodingType.defaultProps = {
  kind: 'compression'
};

ContentEncodingType.spec = {
  container: 'ContentEncoding',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
