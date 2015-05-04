'use strict';

var MediaFormat = require('../core/MediaFormat'),
    Box = require('./Box'),
    FullBox = require('./FullBox');

var clazz = {
  file: require('./File'),
  ftyp: require('./FileTypeBox'),
  moov: require('./MovieBox'),
  mvhd: require('./MovieHeaderBox'),
  trak: require('./TrackBox')
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

module.exports = {
  Box: Box,
  FullBox: FullBox,
  createElement: createElement
};
