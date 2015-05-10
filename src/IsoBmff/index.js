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
  'hmhd': require('./HintMediaHeaderBox'),
  'nmhd': require('./NullMediaHeaderBox'),
  'dinf': require('./DataInformationBox'),
  'dref': require('./DataReferenceBox'),
  'url ': require('./DataEntryUrlBox'),
  'urn ': require('./DataEntryUrnBox'),
  'stbl': require('./SampleTableBox'),
  'stsd': require('./SampleDescriptionBox'),
  'avc1': require('./AVCSampleEntry'),
  'avcC': require('./AVCConfigurationBox'),
  'stts': require('./TimeToSampleBox'),
  'stsz': require('./SampleSizeBox'),
  'stz2': require('./CompactSampleSizeBox'),
  'stsc': require('./SampleToChunkBox')
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
      return [false, '"' + childName + '" cannot be a child of "' + context.container + '"'];
    }
  }

  // Mandatory check.
  checkList[childName] = true;

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

function createElement(type) {
  var componentClass, element, context = {},
      spec, result, errorMessage, checkList;

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
    mandatoryCheckList: {},
    quantityTable: {}
  };

  if (!element.props.children.every(child => {
      [result, errorMessage] = validateChild(context, child);
      return result;
    })) {
    console.error('IsoBmff.createElement: Breaking the composition rule: ' + errorMessage);
    return null;
  }

  checkList = context.mandatoryCheckList;

  spec.mandatoryBoxList.forEach(boxType => {
    if (boxType instanceof Array) {
      if (boxType.some(box => checkList[box])) {
        return;
      }
      boxType = boxType.join('", or "');
    } else {
      if (checkList[boxType]) {
        return;
      }
    }
    console.error('IsoBmff.createElement: Breaking the composition rule: "' +
      boxType + '" is required as a child of "' + context.container + '"');
    element = null;
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
  boxSize = props.size || buffer.length - offset;
  boxEnd = offset + boxSize;

  //console.log(`parse enter.: type=${boxType} size=${boxSize}`);

  if (boxType === 'uuid') {
    boxType = props.extendedType;
  }

  boxClass = clazz[boxType];
  if (!boxClass) {
    console.error('IsoBmff.createElementFromArrayBuffer: Unsupported type - ' + boxType);
    return [boxSize, null];
  }

  [readBytesNum, props] = boxClass.parse(buffer, offset);
  base += readBytesNum;
  if (!props) {
    console.error('IsoBmff.createElementFromArrayBuffer: Failed to parse.');
    return [boxSize, null];
  }

  while (base < boxEnd) {
    [readBytesNum, element] = parse(buffer, base);
    if (element) {
      children.push(element);
      readBytesNum = element.props.size; // Use Box size since it's more reliable.
    }
    base += readBytesNum;
  }
  //console.log(`parse exit.: type=${boxType} readBytesNum=${base - offset}`);
  return [base - offset, MediaFormat.createElement(boxClass, props, children)];
}

function createElementFromArrayBuffer(buffer, offset=0) {
  var base, endOfBuffer, readBytesNum, element, list;

  if (buffer instanceof ArrayBuffer === false) {
    console.error('IsoBmff.createElementFromArrayBuffer: Not an ArrayBuffer.');
    return null;
  }

  base = offset;
  endOfBuffer = base + buffer.byteLength;
  list = [];

  while (base < endOfBuffer) {
    [readBytesNum, element] = parse(new Uint8Array(buffer), base);
    if (!element) {
      base += readBytesNum;
      break;
    }
    list.push(element);
    base += readBytesNum;
  }
  //console.log(`IsoBmff.createElementFromArrayBuffer: Done. ${base - offset} bytes read.`);
  if (list.length === 0) {
    return null;
  } else if (list.length === 1) {
    return list[0];
  }
  return MediaFormat.createElement(clazz.file, null, list);
}

module.exports = {
  createElement: createElement,
  createElementFromArrayBuffer: createElementFromArrayBuffer
};
