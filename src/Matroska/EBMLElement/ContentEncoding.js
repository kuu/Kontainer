import Element from './Element';
import {throwException} from '../../core/Util';

export default class ContentEncoding extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(ContentEncoding.ELEMENT_ID, ContentEncoding.COMPACT_NAME, props);
  }
}

ContentEncoding.COMPACT_NAME = 'ContentEncoding';

ContentEncoding.ELEMENT_ID = [0x62, 0x40];

ContentEncoding.spec = {
  container: 'ContentEncodings',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['ContentEncodingOrder', 'ContentEncodingScope', 'ContentEncodingType']
};
