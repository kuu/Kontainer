import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'CTR':
      return 1;
  }
  throwException(`Unknow cipher mode: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 1:
      return 'CTR';
  }
  throwException(`Unknow cipher mode: (${value})`);
}

export default class AESSettingsCipherMode extends TypeUInt {
  constructor(props) {
    super(AESSettingsCipherMode.ELEMENT_ID, AESSettingsCipherMode.COMPACT_NAME, props);
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

AESSettingsCipherMode.COMPACT_NAME = 'AESSettingsCipherMode';

AESSettingsCipherMode.ELEMENT_ID = [0x47, 0xE8];

AESSettingsCipherMode.propTypes = {
  kind: PropTypes.oneOf(['CTR'])
};

AESSettingsCipherMode.defaultProps = {
  kind: 'CTR'
};

AESSettingsCipherMode.spec = {
  container: 'ContentEncAESSettings',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
