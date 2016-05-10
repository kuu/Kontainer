import Element from './EBMLElement/Element';
import ElementLookup from './ElementLookup';
import Reader from '../core/Reader';
import {throwException} from '../core/Util';

function getComponentClass(name) {
  return ElementLookup.lookupByName(name);
}

function parseTypeAndSize(buffer, offset) {
  const [readBytesNum, props] = Element.parse(buffer, offset);
  const elementClass = ElementLookup.lookupById(props.elementId);
  return [readBytesNum, elementClass, props.size === -1 ? -1 : readBytesNum + props.size];
}

function getRootWrapperClass() {
  return ElementLookup.lookupByName('File');
}

function skipBytes(buffer, offset) {
  for (let i = offset; i < buffer.length; i++) {
    try {
      const [readBytesNum, props] = Element.parse(buffer, i);
      const elementClass = ElementLookup.lookupById(props.elementId, true);
      return i - offset;
    } catch (e) {
      continue;
    }
  }
  throwException('Matroska.skipBytes: Reached the end of buffer.');
}

export default {
  getComponentClass,
  parseTypeAndSize,
  getRootWrapperClass,
  skipBytes
};