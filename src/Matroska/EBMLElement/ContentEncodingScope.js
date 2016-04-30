import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(values) {
  return values.map(value => {
    switch (value) {
    case 'frame':
      return 0x01;
    case 'private':
      return 0x02;
    case 'next':
      return 0x04;
    }
    throwException(`Unknow encoding scope: (${value})`);
  }).reduce((a, b) => (a | b), 0x00);
}

function decodeValue(value) {
  const values = [];
  if (value & 0x01) {
    values.push('frame');
  }
  if (value & 0x02) {
    values.push('private');
  }
  if (value & 0x04) {
    values.push('next');
  }
  return values;
}

export default class ContentEncodingScope extends TypeUInt {
  constructor(props) {
    super(ContentEncodingScope.ELEMENT_ID, ContentEncodingScope.COMPACT_NAME, props);
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

ContentEncodingScope.COMPACT_NAME = 'ContentEncodingScope';

ContentEncodingScope.ELEMENT_ID = [0x50, 0x32];

ContentEncodingScope.propTypes = {
  kind: PropTypes.arrayOf(
    PropTypes.oneOf([
      'frame', 'private', 'next'
    ])
  )
};

ContentEncodingScope.defaultProps = {
  kind: ['frame']
};

ContentEncodingScope.spec = {
  container: 'ContentEncoding',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
