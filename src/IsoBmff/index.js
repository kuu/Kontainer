'use strict';

var MediaFormat = require('../core/MediaFormat'),
    Box = require('./Box');

var clazz = {
  'file': require('./File'),
  'ftyp': require('./FileTypeBox'),
  'moov': require('./MovieBox'),
  'mvhd': require('./MovieHeaderBox'),
  'trak': require('./TrackBox'),
  'tkhd': require('./TrackHeaderBox'),
  'mdia': require('./MediaBox'),
  'mdhd': require('./MediaHeaderBox'),
  'hdlr': require('./HandlerReferenceBox'),
  'minf': require('./MediaInformationBox'),
  'vmhd': require('./VideoMediaHeaderBox'),
  'smhd': require('./SoundMediaHeaderBox'),
  'dinf': require('./DataInformationBox'),
  'dref': require('./DataReferenceBox'),
  'url ': require('./DataEntryUrlBox'),
  'urn ': require('./DataEntryUrnBox')
};

function validateChild(context, child) {
  var childSpec = child.type.spec,
      childName = child.type.COMPACT_NAME,
      container, quantity,
      checkList = context.mandatoryCheckList,
      quantityTable = context.quantityTable;

  // Container check.
  if (childSpec.container) {
    if (childSpec.container instanceof Array) {
      container = childSpec.container;
    } else {
      container = [childSpec.container];
    }
    if (container.indexOf(context.container) === -1) {
      return [false, 'Container of ' + childName + ' is wrong.'];
    }
  }

  // Mandatory check.
  if (checkList.get(childName) !== void 0) {
    checkList.set(childName, true);
  }

  // Quantity check.
  if ((quantity = childSpec.quantity) !== Box.QUANTITY_ANY_NUMBER) {
    // Increment
    if (quantityTable[childName] === void 0) {
      quantityTable[childName] = 1;
    } else {
      quantityTable[childName]++;
    }
    // Validate
    if (quantity === Box.QUANTITY_EXACTLY_ONE) {
      if (quantityTable[childName] !== 1) {
        return [false, 'Quantity of ' + childName + ' should be exactly one.'];
      }
    } else if (quantity === Box.QUANTITY_ZERO_OR_ONE) {
      if (quantityTable[childName] > 1) {
        return [false, 'Quantity of ' + childName + ' should be zero or one.'];
      }
    }
  }
  return [true, null];
}

function createElement(type, props, children) {
  var componentClass, element, context = {},
      spec, result, errorMessage;

  void children;

  // Validate type.
  if (typeof type === 'string') {
    componentClass = clazz[type];
    if (!componentClass) {
      console.error('IsoBmff.createElement: invalid type: "' + type + '"');
      return null;
    }
    arguments[0] = componentClass;
  } else if (!type || !(type.prototype instanceof Box)) {
    console.error('IsoBmff.createElement: "type" should be a subclass of the Box.');
    return null;
  } else {
    componentClass = type;
  }

  // Create element.
  if (!(element = MediaFormat.createElement.apply(this, arguments))) {
    return null;
  }

  // Validate children.
  spec = componentClass.spec;
  context = {
    container: componentClass.COMPACT_NAME,
    mandatoryCheckList: new Map(spec.mandatoryBoxList.map(boxType => [boxType, false])),
    quantityTable: {}
  };

  if (!element.props.children.every(child => {
      [result, errorMessage] = validateChild(context, child);
      return result;
    })) {
    console.error('IsoBmff.createElement: Breaking the composition rule: ' + errorMessage);
    return null;
  }

  spec.mandatoryBoxList.forEach(boxType => {
    if (!context.mandatoryCheckList.get(boxType)) {
      console.error('IsoBmff.createElement: Breaking the composition rule: "' +
        boxType + '" is required as a child of "' + context.container + '"');
      element = null;
    }
  });

  return element;
}

function parse(buffer, offset) {
  var readBytesNum, props, boxSize, boxType, boxClass,
      base = offset, boxEnd, element, children = [];

  // Read the Box params as we don't know the type.
  [readBytesNum, props] = Box.parse(buffer, offset);
  if (!props) {
    console.error('IsoBmff.createElementFromArrayBuffer: Failed to parse.');
    return [0, null];
  }

  boxType = props.type;
  boxSize = props.size;

  if (boxType === 'uuid') {
    boxType = props.extendedType;
  }

  boxClass = clazz[boxType];
  if (!boxClass) {
    console.error('IsoBmff.createElementFromArrayBuffer: Unsupported type - ' + boxType);
    return [0, null];
  }

  [readBytesNum, props] = boxClass.parse(buffer, offset);
  if (!props) {
    console.error('IsoBmff.createElementFromArrayBuffer: Failed to parse.');
    return [0, null];
  }

  base += (boxSize || readBytesNum);
  boxEnd = buffer.length;

  while (base < boxEnd) {
    [readBytesNum, element] = parse(buffer, base);
    if (!element) {
      break;
    }
    children.push(element);
    base += (element.props.size || readBytesNum);
  }
  return [base - offset, MediaFormat.createElement(boxClass, props, children)];
}

function createElementFromArrayBuffer(buffer, offset=0) {
  var readBytesNum, element;

  if (buffer instanceof ArrayBuffer === false) {
    console.error('IsoBmff.createElementFromArrayBuffer: Not an ArrayBuffer.');
    return null;
  }
  [readBytesNum, element] = parse(new Uint8Array(buffer), offset);
  void readBytesNum;
  return element;
}

module.exports = {
  createElement: createElement,
  createElementFromArrayBuffer: createElementFromArrayBuffer
};
