import Element from './Element';
import {throwException} from '../../core/Util';

export default class ContentEncodings extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(ContentEncodings.ELEMENT_ID, ContentEncodings.COMPACT_NAME, props);
  }
}

ContentEncodings.COMPACT_NAME = 'ContentEncodings';

ContentEncodings.ELEMENT_ID = [0x6D, 0x80];

ContentEncodings.spec = {
  container: 'TrackEntry',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: ['ContentEncoding']
};
