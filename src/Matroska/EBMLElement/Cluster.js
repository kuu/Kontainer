import Element from './Element';

export default class Cluster extends Element {
  constructor(props) {
    props.initialSizeLen = 4;
    super(Cluster.ELEMENT_ID, Cluster.COMPACT_NAME, props);
  }
}

Cluster.COMPACT_NAME = 'Cluster';

Cluster.ELEMENT_ID = [0x1f, 0x43, 0xb6, 0x75];

Cluster.spec = {
  container: ['Segment', 'Cluster'],
  quantity: Element.QUANTITY_ANY_NUMBER,
  mandatoryList: ['Timecode']
};
