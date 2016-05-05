import Element from './Element';
import {throwException} from '../../core/Util';

export default class ContentEncryption extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(ContentEncryption.ELEMENT_ID, ContentEncryption.COMPACT_NAME, props);
  }

  static validate(context, props) {
    const contentEncodingType = context.contentEncodingType;
    if (contentEncodingType && contentEncodingType !== 'encryption') {
      throwException(`ContentEncodingType is not "encryption" but "${contentEncodingType}"`);
    }
  }
}

ContentEncryption.COMPACT_NAME = 'ContentEncryption';

ContentEncryption.ELEMENT_ID = [0x50, 0x35];

ContentEncryption.spec = {
  container: 'ContentEncoding',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
