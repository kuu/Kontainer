import Element from './Element';

export default class EBML extends Element {
  constructor(props) {
    props.initialSizeLen = 4;
    super(EBML.ELEMENT_ID, EBML.COMPACT_NAME, props);
  }
}

EBML.COMPACT_NAME = 'EBML';

EBML.ELEMENT_ID = [0x1a, 0x45, 0xdf, 0xa3];

EBML.spec = {
  container: 'File',
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['EBMLVersion', 'EBMLReadVersion', 'EBMLMaxIDLength', 'EBMLMaxSizeLength', 'DocType', 'DocTypeVersion', 'DocTypeReadVersion']
};
