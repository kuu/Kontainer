'use strict';

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

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
  'stsc': require('./SampleToChunkBox'),
  'stco': require('./ChunkOffsetBox'),
  'mp4a': require('./MP4AudioSampleEntry'),
  'esds': require('./ESDBox'),
  'mdat': require('./MediaDataBox'),
  'btrt': require('./MPEG4BitRateBox'),
  'stss': require('./SyncSampleBox'),
  'mvex': require('./MovieExtendsBox'),
  'mehd': require('./MovieExtendsHeaderBox'),
  'trex': require('./TrackExtendsBox')
};

function validateChild(context, child) {
  var childSpec = child.type.spec,
      childName = child.type.COMPACT_NAME,
      container,
      quantity,
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
  var componentClass,
      element,
      context = {},
      spec,
      result,
      errorMessage,
      checkList;

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

  if (!element.props.children.every(function (child) {
    var _validateChild = validateChild(context, child);

    var _validateChild2 = _slicedToArray(_validateChild, 2);

    result = _validateChild2[0];
    errorMessage = _validateChild2[1];

    return result;
  })) {
    console.error('IsoBmff.createElement: Breaking the composition rule: ' + errorMessage);
    return null;
  }

  checkList = context.mandatoryCheckList;

  spec.mandatoryBoxList.forEach(function (boxType) {
    if (boxType instanceof Array) {
      if (boxType.some(function (box) {
        return checkList[box];
      })) {
        return;
      }
      boxType = boxType.join('", or "');
    } else {
      if (checkList[boxType]) {
        return;
      }
    }
    console.error('IsoBmff.createElement: Breaking the composition rule: "' + boxType + '" is required as a child of "' + context.container + '"');
    element = null;
  });

  return element;
}

function parse(buffer, offset) {
  var readBytesNum,
      props,
      boxSize,
      boxType,
      boxClass,
      base = offset,
      boxEnd,
      element,
      children = [];

  // Read the Box params as we don't know the type.

  var _Box$parse = Box.parse(buffer, offset);

  var _Box$parse2 = _slicedToArray(_Box$parse, 2);

  readBytesNum = _Box$parse2[0];
  props = _Box$parse2[1];

  if (!props) {
    console.error('IsoBmff.createElementFromBuffer: Failed to parse.');
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
    console.error('IsoBmff.createElementFromBuffer: Unsupported type - "' + boxType + '"');
    return [boxSize, null];
  }

  var _boxClass$parse = boxClass.parse(buffer, offset);

  var _boxClass$parse2 = _slicedToArray(_boxClass$parse, 2);

  readBytesNum = _boxClass$parse2[0];
  props = _boxClass$parse2[1];

  base += readBytesNum;
  if (!props) {
    console.error('IsoBmff.createElementFromBuffer: Failed to parse.');
    return [boxSize, null];
  }

  while (base < boxEnd) {
    var _parse = parse(buffer, base);

    var _parse2 = _slicedToArray(_parse, 2);

    readBytesNum = _parse2[0];
    element = _parse2[1];

    if (element) {
      children.push(element);
      readBytesNum = element.props.size; // Use Box size since it's more reliable.
    }
    base += readBytesNum;
  }
  //console.log(`parse exit.: type=${boxType} readBytesNum=${base - offset}`);
  return [base - offset, MediaFormat.createElement(boxClass, props, children)];
}

function createElementFromBuffer(buffer) {
  var offset = arguments[1] === undefined ? 0 : arguments[1];

  var base = offset,
      endOfBuffer,
      readBytesNum,
      element,
      elementList = [];

  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer);
  }
  endOfBuffer = base + buffer.length;

  while (base < endOfBuffer) {
    var _parse3 = parse(buffer, base);

    var _parse32 = _slicedToArray(_parse3, 2);

    readBytesNum = _parse32[0];
    element = _parse32[1];

    if (!element) {
      base += readBytesNum;
      break;
    }
    elementList.push(element);
    base += readBytesNum;
  }
  //console.log(`IsoBmff.createElementFromBuffer: Done. ${base - offset} bytes read.`);
  if (elementList.length === 0) {
    return null;
  } else if (elementList.length === 1) {
    return elementList[0];
  }
  return MediaFormat.createElement(clazz.file, null, elementList);
}

module.exports = {
  createElement: createElement,
  createElementFromBuffer: createElementFromBuffer
};