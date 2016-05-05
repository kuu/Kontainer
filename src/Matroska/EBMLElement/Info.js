import Element from './Element';

export default class Info extends Element {
  constructor(props) {
    props.initialSizeLen = 2;
    super(Info.ELEMENT_ID, Info.COMPACT_NAME, props);
  }
}

Info.COMPACT_NAME = 'Info';

Info.ELEMENT_ID = [0x15, 0x49, 0xa9, 0x66];

Info.spec = {
  container: 'Segment',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['TimecodeScale', 'MuxingApp', 'WritingApp']
};
