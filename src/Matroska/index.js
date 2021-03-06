import Element from './EBMLElement/Element';
import ElementLookup from './ElementLookup';
import Reader from '../core/Reader';
import {throwException} from '../core/Util';
import {BufferReadError} from '../core/Error';

function getComponentClass(name) {
  return ElementLookup.lookupByName(name);
}

function parseTypeAndSize(buffer, offset, options={}) {
  const [readBytesNum, props] = Element.parse(buffer, offset);
  const elementClass = ElementLookup.lookupById(props.elementId, !!options.ignoreUnknown);
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

function canParse(buffer, offset) {
  let readBytesNum, componentClass;

  try {
    [readBytesNum, componentClass] = parseTypeAndSize(buffer, offset);
    if (componentClass) {
      [readBytesNum] = componentClass.parse(buffer, offset);
      return true;
    }
  } catch (err) {
    if (componentClass && err.message === BufferReadError.ERROR_MESSAGE) {
      return true;
    }
  }
  return false;
}

export default {
  name: 'webm',
  getComponentClass,
  parseTypeAndSize,
  getRootWrapperClass,
  skipBytes,
  canParse
};
