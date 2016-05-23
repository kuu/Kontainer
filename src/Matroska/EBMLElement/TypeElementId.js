import Element from './Element';
import {throwException} from '../../core/Util';

export default class TypeElementId extends Element {
  constructor(...params) {
    super(...params);
  }

  static validate(context, props) {
    const maxIdLength = context.maxIdLength;
    if (maxIdLength) {
      const ElementLookup = require('../ElementLookup').default;
      const elementId = ElementLookup.lookupByName(props.value).ELEMENT_ID;
      if (elementId.length > maxIdLength) {
        throwException(`Element Id(len=${elementId.length}) cannot exceed the EBMLMaxIDLength(${maxIdLength})`);
      }
    }
  }

  serialize(buffer, offset=0) {
    const ElementLookup = require('../ElementLookup').default;
    const elementId = ElementLookup.lookupByName(this.props.value).ELEMENT_ID;

    let base = offset;

    super.setElementSize(elementId.length);

    base += super.serialize(buffer, base);

    if (buffer) {
      for (let i = 0; i < elementId.length; i++) {
        buffer[base + i] = elementId[i];
      }
    }
    base += elementId.length;

    return this.size;
  }

  static parse(buffer, offset=0) {
    const ElementLookup = require('../ElementLookup').default;

    let base = offset,
        readBytesNum, props, elementId;

    [readBytesNum, props] = Element.parse(buffer, base);
    base += readBytesNum;

    [readBytesNum, elementId] = Element.readElementId(buffer, base);;
    base += readBytesNum;

    props.value = ElementLookup.lookupById(elementId).COMPACT_NAME;

    return [base - offset, props];
  }
}
