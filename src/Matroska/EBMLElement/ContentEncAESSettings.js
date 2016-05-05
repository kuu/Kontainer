import Element from './Element';
import {throwException} from '../../core/Util';

export default class ContentEncAESSettings extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(ContentEncAESSettings.ELEMENT_ID, ContentEncAESSettings.COMPACT_NAME, props);
  }

  static validate(context, props) {
    const contentEncAlgo = context.contentEncAlgo;
    if (contentEncAlgo && contentEncAlgo !== 'AES') {
      throwException(`ContentEncAlgo is not "AES" but "${contentEncAlgo}"`);
    }
  }
}

ContentEncAESSettings.COMPACT_NAME = 'ContentEncAESSettings';

ContentEncAESSettings.ELEMENT_ID = [0x47, 0xE7];

ContentEncAESSettings.spec = {
  container: 'ContentEncryption',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
