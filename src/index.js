import IsoBmff from './IsoBmff';
import Matroska from './Matroska';
import Reader from './core/Reader';
import Writer from './core/Writer';
import Buffer from './core/Buffer';
import Component from './core/Component';
import {Visitor, ElementVisitor, DumpVisitor} from './core/Visitor';
import {TransformStream} from './core/Stream';
import {BufferReadError} from './core/Error';
import {createElement as createBaseElement} from './core/MediaFormat';
import {throwException} from './core/Util';

let currentFormat = IsoBmff;

function use(format) {
  if (format === 'mp4') {
    currentFormat = IsoBmff;
  } else if (format === 'webm') {
    currentFormat = Matroska;
  } else {
    console.error(`[Kontainer.use] Unsupported format: "${format}"`);
  }
}

function checkContainerFormat(buffer, offset=0) {
  if (Matroska.canParse(buffer, offset)) {
    return 'webm'
  }
  if (IsoBmff.canParse(buffer, offset)) {
    return 'mp4';
  }
  return 'unknown';
}

function detectFormat(buffer, offset=0) {
  const format = checkContainerFormat(buffer, offset);
  if (format === 'unknown') {
    return false;
  } else if (format === 'mp4') {
    currentFormat = IsoBmff;
  } else if (format === 'webm') {
    currentFormat = Matroska;
  }
  return true;
}

function traverse(context, element, buffer, offset=0) {
  let type, props, children, instance,
      propTypes, base = offset, err;

  if (!element) {
    console.warn('Kontainer.render: null element.');
    return 0;
  }

  type = element.type;
  props = element.props;
  children = props.children;
  instance = element.instance;

  //console.log(`traverse enter. type=${type.COMPACT_NAME}`);

  if (!instance) {
    // Validate props
    propTypes = type.propTypes;
    if (propTypes) {
      if (!Object.keys(propTypes).every(key => {
        err = propTypes[key](props, key, type.COMPACT_NAME);
        if (err) {
          return false;
        }
        return true;
      })) {
        throwException('Kontainer.render: Prop validation failed: ' + err.message);
      }
    }
    // Validate context
    type.validate(context, props);
    // Instantiation
    instance = element.instance = new type(props);
  }

  // Write self to the array buffer.
  base += instance.serialize(buffer, offset);

  // Write children to the array buffer.
  children.forEach(child => {
    base += traverse(context, child, buffer, base);
  });

  // Update the size.
  instance.setSize(base - offset, buffer, offset);

  //console.log(`traverse exit. type=${type.COMPACT_NAME} size=${instance.getSize()}`);
  return instance.getSize();
}

function render(element, options={}) {
  let size, buffer, context = {};

  try {
    // Culculate the entire byte size.
    size = traverse(context, element);
  } catch (err) {
    console.error(`render: An error occurred in culculating the buffer size: ${err.stack}`);
    return null;
  }

  if (options.dryRun) {
    return size;
  }

  if (size === 0) {
    return null;
  }

  // Write to the array buffer.
  buffer = new Buffer(size);
  traverse(context, element, buffer.getView());

  return buffer.getData();
}

function validateChild(context, child) {
  const childSpec = child.type.spec;
  const childName = child.type.COMPACT_NAME;
  const checkList = context.mandatoryCheckList;
  const quantityTable = context.quantityTable;

  let container, quantity;

  // Container check.
  if (childSpec.container && childSpec.container !== '*') {
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
  if ((quantity = childSpec.quantity) !== Component.QUANTITY_ANY_NUMBER) {
    // Increment
    if (quantityTable[childName] === void 0) {
      quantityTable[childName] = 1;
    } else {
      quantityTable[childName]++;
    }
    // Validate
    if (quantity === Component.QUANTITY_EXACTLY_ONE) {
      if (quantityTable[childName] !== 1) {
        return [false, 'Quantity of ' + childName + ' should be exactly one.'];
      }
    } else if (quantity === Component.QUANTITY_ZERO_OR_ONE) {
      if (quantityTable[childName] > 1) {
        return [false, 'Quantity of ' + childName + ' should be zero or one.'];
      }
    }
  }
  return [true, null];
}

function createElement(type, ...otherParams) {
  let componentClass, element, context = {},
      spec, result, errorMessage, checkList;

  // Validate type.
  if (typeof type === 'string') {
    componentClass = currentFormat.getComponentClass(type);
    if (!componentClass) {
      console.error(`createElement: invalid type: "${type}"`);
      return null;
    }
  } else if (!type || !(type instanceof Component)) {
    console.error('createElement: "type" should be a subclass of the Component.');
    return null;
  } else {
    componentClass = type;
  }

  // Create element.
  if (!(element = createBaseElement(componentClass, ...otherParams))) {
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
    console.error(`createElement: Breaking the composition rule: ${errorMessage}`);
    return null;
  }

  checkList = context.mandatoryCheckList;

  spec.mandatoryList.forEach(boxType => {
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
    console.error(`createElement: Breaking the composition rule: "${boxType}" is required as a child of "${context.container}"`);
    element = null;
  });

  return element;
}

function parse(buffer, offset, visitor, options) {
  let readBytesNum;
  let props;
  let base = offset;

  let componentClass, componentSize;

  // Read the first bytes as we don't know the type and the size.
  [readBytesNum, componentClass, componentSize] = currentFormat.parseTypeAndSize(buffer, offset, options);

  if (!componentClass) {
    visitor.offset = base;
    return componentSize;
  }

  let bytesToSkip = 0;

  if (componentSize === -1) {
    // Unknown size. Naive code.
    bytesToSkip = currentFormat.skipBytes(buffer, offset + readBytesNum);
  }

  const componentEnd = componentSize === -1 ? buffer.length : offset + componentSize;
  const componentName = componentClass.COMPACT_NAME;

  //console.log(`parse enter.: type=${componentName} size=${componentSize} offset=${offset}`);

  if (componentSize === -1) {
    try {
      [readBytesNum, props] = componentClass.parse(buffer, offset);
    } catch (e) {
      props = {size: -1};
    }
    readBytesNum += bytesToSkip;
  } else {
    [readBytesNum, props] = componentClass.parse(buffer, offset);
  }
  base += readBytesNum;
  visitor.offset = base;
  visitor.enter(componentClass, props);

  while (base < componentEnd) {
    readBytesNum = parse(buffer, base, visitor, options);
    base += readBytesNum;
  }
  visitor.exit();
  visitor.offset = base;

  //console.log(`parse exit.: type=${componentName} readBytesNum=${Math.min(base - offset, componentSize)}`);

  return Math.min(base - offset, componentSize);
}

function createElementFromBuffer(buffer, offset=0, options={}) {
  let base = offset;

  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer);
  }

  if (detectFormat(buffer, base) === false) {
    console.error('createElementFromBuffer: Unknown format');
    return null;
  }

  const endOfBuffer = base + buffer.length;

  const visitor = new ElementVisitor();

  try {
    while (base < endOfBuffer) {
      const readBytesNum = parse(buffer, base, visitor, options);
      base += readBytesNum;
    }
  } catch (err) {
    if (err.message !== BufferReadError.ERROR_MESSAGE) {
      console.error(`createElementFromBuffer: An error occurred in parsing the buffer: ${err.stack}`);
    }
    return null;
  }
  //console.log(`createElementFromBuffer: Done. ${base - offset} bytes read.`);
  if (visitor.results.length === 0) {
    return null;
  } else if (visitor.results.length === 1) {
    return visitor.results[0];
  }
  return createBaseElement(currentFormat.getRootWrapperClass(), null, ...visitor.results);
}

function transform(visitor, options={}) {
  let vtor, formatSet = false;

  if (visitor instanceof Visitor) {
    vtor = visitor;
  } else {
    // Received a filter function
    class TransformVisitor extends ElementVisitor {
      visit(type, props, children) {
        visitor && visitor(type.COMPACT_NAME, props, children);
        return super.visit(type, props, children);
      }
    }
    vtor = new TransformVisitor();
  }

  return new TransformStream((buffer, offset, cb) => {
    let base = vtor.offset;
    let buf = buffer.getData();

    if (buf instanceof ArrayBuffer) {
      buf = new Uint8Array(buf);
    }

    if (!formatSet && detectFormat(buf, base) === false) {
      // Unknow format or the buffer is insufficient.
      cb('done', null);
      return;
    }

    formatSet = true;

    cb('format', currentFormat === IsoBmff ? 'mp4' : 'webm');

    const endOfBuffer = buf.length;
    try {
      while (base < endOfBuffer) {
        const readBytesNum = parse(buf, base, vtor, options);
        base += readBytesNum;
      }
    } catch (err) {
      if (err.message !== BufferReadError.ERROR_MESSAGE) {
        console.error(`transform: An error occurred in parsing the buffer: ${err.stack}`);
      }
      cb('done', null);
      return;
    }

    while (vtor.stack.length) {
      vtor.exit();
    }

    if (options.until) {
      options.until.then(() => {
        cb('done', render(createBaseElement(currentFormat.getRootWrapperClass(), null, ...vtor.results)));
      });
    } else {
      cb('done', render(createBaseElement(currentFormat.getRootWrapperClass(), null, ...vtor.results)));
    }
  });
}

export default {
  use,
  checkContainerFormat,
  get mode() {
    return currentFormat === Matroska ? 'webm' : 'mp4';
  },
  render,
  createElement,
  createElementFromBuffer,
  transform,
  ElementVisitor,
  DumpVisitor
};
