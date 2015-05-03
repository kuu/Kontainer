'use strict';

var MediaFormat = require('../core/MediaFormat'),
    Box = require('./Box'),
    FullBox = require('./FullBox');

var clazz = {
  ftyp: require('./FileTypeBox')
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
      return false;
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
        return false;
      }
    } else if (quantity === Box.QUANTITY_ZERO_OR_ONE) {
      if (quantityTable[childName] > 1) {
        return false;
      }
    }
  }
}

function createElement(type, props, children) {
  var element, context = {};

  void children;

  // Validate type.
  if (typeof type === 'string') {
    type = clazz[type];
    if (!type) {
      console.error('IsoBmff.createElement: invalid type: "' + type + '"');
      return null;
    }
    arguments[0] = type;
  } else if (!type || !(type.prototype instanceof Box)) {
    console.error('IsoBmff.createElement: "type" should be a subclass of the Box.');
    return null;
  }

  // Create element.
  if (!(element = MediaFormat.createElement.apply(this, arguments))) {
    return null;
  }

  // Validate children.
  context = {
    container: type.COMPACT_NAME,
    mandatoryCheckList: new Map(type.spec.mandatoryBoxList.map(boxType => [boxType, false])),
    quantityTable: {}
  };

  if (!element.props.children.every(child => {
      return validateChild(context, child);
    })) {
    console.error('IsoBmff.createElement: Breaking the rule of composition.');
    return null;
  }
  return element;
}

module.exports = {
  Box: Box,
  FullBox: FullBox,
  createElement: createElement
};
