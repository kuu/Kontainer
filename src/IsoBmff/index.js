import MediaFormat from '../core/MediaFormat';
import Box from './Box';
import {TransformStream} from '../core/Stream';
import {BoxVisitor, IsoBmffDumpVisitor} from './BoxVisitor';

const clazz = {
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
  'trex': require('./TrackExtendsBox'),
  'moof': require('./MovieFragmentBox'),
  'mfhd': require('./MovieFragmentHeaderBox'),
  'traf': require('./TrackFragmentBox'),
  'tfhd': require('./TrackFragmentHeaderBox'),
  'trun': require('./TrackRunBox'),
  'tfdt': require('./TrackFragmentBaseMediaDecodeTimeBox')
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

function parse(buffer, offset, visitor) {
  let readBytesNum;
  let props;
  let base = offset;

  // Read the Box params as we don't know the type.
  [readBytesNum, props] = Box.parse(buffer, offset);

  let boxType = props.type;
  const boxSize = props.size || buffer.length - offset;
  const boxEnd = offset + boxSize;

  if (boxType === 'uuid') {
    boxType = props.extendedType;
  }

  //console.log(`parse enter.: type=${boxType} size=${boxSize} offset=${offset}`);

  const boxClass = clazz[boxType];
  if (!boxClass) {
    console.error(`IsoBmff.createElementFromBuffer: Unsupported type - "${boxType}"`);
    return boxSize;
  }

  [readBytesNum, props] = boxClass.parse(buffer, offset);
  base += readBytesNum;

  const stack = visitor.stack;
  visitor.offset = base;
  stack.push({type: boxClass, props, children: []});
  visitor.enter(boxClass, props);

  while (base < boxEnd) {
    readBytesNum = parse(buffer, base, visitor);
    base += readBytesNum;
  }
  const children = stack[stack.length - 1].children;
  const result = visitor.exit(boxClass, props, children);
  stack.pop();
  visitor.offset = base;
  if (result && stack.length > 0) {
    stack[stack.length - 1].children.push(result);
  }

  //console.log(`parse exit.: type=${boxType} readBytesNum=${base - offset}`);
  return base - offset;
}

class ElementVisitor extends BoxVisitor {
  constructor() {
    super();
    this.topLevel = [];
  }

  enter (type, props) {
    this.setData({element: MediaFormat.createElement(type, props)});
  }

  exit (type, props, children) {
    const {element} = this.getData();
    element.props.children = children;
    if (this.depth() === 0) {
      this.topLevel.push(element);
    }
    return element;
  }
}

function createElementFromBuffer(buffer, offset=0) {
  let base = offset;

  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer);
  }
  const endOfBuffer = base + buffer.length;

  const visitor = new ElementVisitor();

  try {
    while (base < endOfBuffer) {
      const readBytesNum = parse(buffer, base, visitor);
      base += readBytesNum;
    }
  } catch (err) {
    console.error('IsoBmff.createElementFromBuffer: an error occurred in parsing the buffer');
    return null;
  }
  //console.log(`IsoBmff.createElementFromBuffer: Done. ${base - offset} bytes read.`);
  if (visitor.topLevel.length === 0) {
    return null;
  } else if (visitor.topLevel.length === 1) {
    return visitor.topLevel[0];
  }
  return MediaFormat.createElement(clazz.file, null, visitor.topLevel);
}

function transform(visitor) {
  return new TransformStream((buffer, offset, done) => {
    let base = visitor.offset;
    let buf = buffer.getData();

    if (buf instanceof ArrayBuffer) {
      buf = new Uint8Array(buf);
    }
    const endOfBuffer = buf.length;
    const stack = visitor.stack;
    try {
      while (base < endOfBuffer) {
        const readBytesNum = parse(buf, base, visitor);
        base += readBytesNum;
      }
    } catch (err) {
      //console.error(`IsoBmff.transform: An error occurred in parsing the buffer: ${err}`);
      done(null, null);
      return;
    }

    while (stack.length) {
      const {type, props, children} = stack[stack.length - 1];
      const result = visitor.exit(type, props, children);
      stack.pop();
      if (result && stack.length > 0) {
        stack[stack.length - 1].children.push(result);
      }
    }
    done(null, null);
  });
}

export {
  createElement,
  createElementFromBuffer,
  transform,
  BoxVisitor,
  IsoBmffDumpVisitor
};
