import Element from './Element';

export default class Targets extends Element {
  constructor(props) {
    props.initialSizeLen = 1;
    super(Targets.ELEMENT_ID, Targets.COMPACT_NAME, props);
  }
}

Targets.COMPACT_NAME = 'Targets';

Targets.ELEMENT_ID = [0x63, 0xC0];

Targets.spec = {
  container: 'Tag',
  quantity: Element.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
