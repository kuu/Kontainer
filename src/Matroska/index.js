import Element from './EBMLElement/Element';
import ElementLookup from './ElementLookup';

function getComponentClass(name) {
  return ElementLookup.lookupByName(name);
}

function parseTypeAndSize(buffer, offset) {
  const [readBytesNum, props] = Element.parse(buffer, offset);
  const elementClass = ElementLookup.lookupById(props.elementId);
  return [elementClass, props.size === -1 ? -1 : readBytesNum + props.size];
}

function getRootWrapperClass() {
  return ElementLookup.lookupByName('File');
}

export default {
  getComponentClass,
  parseTypeAndSize,
  getRootWrapperClass
};
