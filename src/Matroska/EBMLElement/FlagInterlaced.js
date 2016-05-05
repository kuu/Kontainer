import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';

function encodeValue(value) {
  switch (value) {
    case 'interlaced':
      return 0x01;
    case 'progressive':
      return 0x02;
  }
  return 0;
}

function decodeValue(value) {
  switch (value) {
    case 0x01:
      return 'interlaced';
    case 0x02:
      return 'progressive';
  }
  return 'undetermined';
}

export default class FlagInterlaced extends TypeUInt {
  constructor(props) {
    super(FlagInterlaced.ELEMENT_ID, FlagInterlaced.COMPACT_NAME, props);
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

FlagInterlaced.COMPACT_NAME = 'FlagInterlaced';

FlagInterlaced.ELEMENT_ID = [0x9A];

FlagInterlaced.propTypes = {
  kind: PropTypes.oneOf(['interlaced', 'progressive', 'undetermined']).isRequired
};

FlagInterlaced.defaultProps = {
  value: 'undetermined'
};

FlagInterlaced.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
