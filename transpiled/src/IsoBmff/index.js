'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _MediaFormat = require('../core/MediaFormat');

var _MediaFormat2 = _interopRequireDefault(_MediaFormat);

var _Box = require('./Box');

var _Box2 = _interopRequireDefault(_Box);

var _Stream = require('../core/Stream');

var _BoxVisitor2 = require('./BoxVisitor');

var _Error = require('../core/Error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var clazz = {
  'file': require('./File').default,
  'ftyp': require('./FileTypeBox').default,
  'moov': require('./MovieBox').default,
  'mvhd': require('./MovieHeaderBox').default,
  'trak': require('./TrackBox').default,
  'tkhd': require('./TrackHeaderBox').default,
  'mdia': require('./MediaBox').default,
  'mdhd': require('./MediaHeaderBox').default,
  'hdlr': require('./HandlerReferenceBox').default,
  'minf': require('./MediaInformationBox').default,
  'vmhd': require('./VideoMediaHeaderBox').default,
  'smhd': require('./SoundMediaHeaderBox').default,
  'hmhd': require('./HintMediaHeaderBox').default,
  'nmhd': require('./NullMediaHeaderBox').default,
  'dinf': require('./DataInformationBox').default,
  'dref': require('./DataReferenceBox').default,
  'url ': require('./DataEntryUrlBox').default,
  'urn ': require('./DataEntryUrnBox').default,
  'stbl': require('./SampleTableBox').default,
  'stsd': require('./SampleDescriptionBox').default,
  'avc1': require('./AVCSampleEntry').default,
  'avcC': require('./AVCConfigurationBox').default,
  'stts': require('./TimeToSampleBox').default,
  'stsz': require('./SampleSizeBox').default,
  'stz2': require('./CompactSampleSizeBox').default,
  'stsc': require('./SampleToChunkBox').default,
  'stco': require('./ChunkOffsetBox').default,
  'mp4a': require('./MP4AudioSampleEntry').default,
  'esds': require('./ESDBox').default,
  'mdat': require('./MediaDataBox').default,
  'btrt': require('./MPEG4BitRateBox').default,
  'stss': require('./SyncSampleBox').default,
  'mvex': require('./MovieExtendsBox').default,
  'mehd': require('./MovieExtendsHeaderBox').default,
  'trex': require('./TrackExtendsBox').default,
  'moof': require('./MovieFragmentBox').default,
  'mfhd': require('./MovieFragmentHeaderBox').default,
  'traf': require('./TrackFragmentBox').default,
  'tfhd': require('./TrackFragmentHeaderBox').default,
  'trun': require('./TrackRunBox').default,
  'tfdt': require('./TrackFragmentBaseMediaDecodeTimeBox').default
};

function validateChild(context, child) {
  var childSpec = child.type.spec;
  var childName = child.type.COMPACT_NAME;
  var checkList = context.mandatoryCheckList;
  var quantityTable = context.quantityTable;

  var container = undefined,
      quantity = undefined;

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
  if ((quantity = childSpec.quantity) !== _Box2.default.QUANTITY_ANY_NUMBER) {
    // Increment
    if (quantityTable[childName] === void 0) {
      quantityTable[childName] = 1;
    } else {
      quantityTable[childName]++;
    }
    // Validate
    if (quantity === _Box2.default.QUANTITY_EXACTLY_ONE) {
      if (quantityTable[childName] !== 1) {
        return [false, 'Quantity of ' + childName + ' should be exactly one.'];
      }
    } else if (quantity === _Box2.default.QUANTITY_ZERO_OR_ONE) {
      if (quantityTable[childName] > 1) {
        return [false, 'Quantity of ' + childName + ' should be zero or one.'];
      }
    }
  }
  return [true, null];
}

function createElement(type) {
  var componentClass = undefined,
      element = undefined,
      context = {},
      spec = undefined,
      result = undefined,
      errorMessage = undefined,
      checkList = undefined;

  // Validate type.
  if (typeof type === 'string') {
    componentClass = clazz[type];
    if (!componentClass) {
      console.error('IsoBmff.createElement: invalid type: "' + type + '"');
      return null;
    }
    arguments[0] = componentClass;
  } else if (!type || !(type.prototype instanceof _Box2.default)) {
    console.error('IsoBmff.createElement: "type" should be a subclass of the Box.');
    return null;
  } else {
    componentClass = type;
  }

  // Create element.
  if (!(element = _MediaFormat2.default.createElement.apply(this, arguments))) {
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

function parse(buffer, offset, visitor) {
  var readBytesNum = undefined;
  var props = undefined;
  var base = offset;

  // Read the Box params as we don't know the type.

  var _Box$parse = _Box2.default.parse(buffer, offset);

  var _Box$parse2 = _slicedToArray(_Box$parse, 2);

  readBytesNum = _Box$parse2[0];
  props = _Box$parse2[1];


  var boxSize = props.size || buffer.length - offset;
  var boxEnd = offset + boxSize;
  var boxType = props.type === 'uuid' ? props.extendedType : props.type;
  var boxClass = clazz[boxType];

  //console.log(`parse enter.: type=${boxType} size=${boxSize} offset=${offset}`);

  if (!boxClass) {
    console.error('IsoBmff.createElementFromBuffer: Unsupported type - "' + boxType + '"');
    return boxSize;
  }

  var _boxClass$parse = boxClass.parse(buffer, offset);

  var _boxClass$parse2 = _slicedToArray(_boxClass$parse, 2);

  readBytesNum = _boxClass$parse2[0];
  props = _boxClass$parse2[1];

  base += readBytesNum;

  var stack = visitor.stack;
  visitor.offset = base;
  stack.push({ type: boxClass, props: props, children: [] });
  visitor.enter(boxClass, props);

  while (base < boxEnd) {
    readBytesNum = parse(buffer, base, visitor);
    base += readBytesNum;
  }
  var children = stack[stack.length - 1].children;
  var result = visitor.exit(boxClass, props, children);
  stack.pop();
  visitor.offset = base;
  if (result && stack.length > 0) {
    stack[stack.length - 1].children.push(result);
  }

  //console.log(`parse exit.: type=${boxType} readBytesNum=${base - offset}`);
  return base - offset;
}

var ElementVisitor = function (_BoxVisitor) {
  _inherits(ElementVisitor, _BoxVisitor);

  function ElementVisitor() {
    _classCallCheck(this, ElementVisitor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ElementVisitor).call(this));

    _this.topLevel = [];
    return _this;
  }

  _createClass(ElementVisitor, [{
    key: 'enter',
    value: function enter(type, props) {
      this.setData({ element: _MediaFormat2.default.createElement(type, props) });
    }
  }, {
    key: 'exit',
    value: function exit(type, props, children) {
      var _getData = this.getData();

      var element = _getData.element;

      element.props.children = children;
      if (this.depth() === 0) {
        this.topLevel.push(element);
      }
      return element;
    }
  }]);

  return ElementVisitor;
}(_BoxVisitor2.BoxVisitor);

function createElementFromBuffer(buffer) {
  var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var base = offset;

  if (buffer instanceof ArrayBuffer) {
    buffer = new Uint8Array(buffer);
  }
  var endOfBuffer = base + buffer.length;

  var visitor = new ElementVisitor();

  try {
    while (base < endOfBuffer) {
      var readBytesNum = parse(buffer, base, visitor);
      base += readBytesNum;
    }
  } catch (err) {
    if (err.message !== _Error.BufferReadError.ERROR_MESSAGE) {
      console.error('IsoBmff.transform: An error occurred in parsing the buffer: ' + err.stack);
    }
    return null;
  }
  //console.log(`IsoBmff.createElementFromBuffer: Done. ${base - offset} bytes read.`);
  if (visitor.topLevel.length === 0) {
    return null;
  } else if (visitor.topLevel.length === 1) {
    return visitor.topLevel[0];
  }
  return _MediaFormat2.default.createElement(clazz.file, null, visitor.topLevel);
}

function transform(visitor) {
  return new _Stream.TransformStream(function (buffer, offset, done) {
    var base = visitor.offset;
    var buf = buffer.getData();

    if (buf instanceof ArrayBuffer) {
      buf = new Uint8Array(buf);
    }
    var endOfBuffer = buf.length;
    var stack = visitor.stack;
    try {
      while (base < endOfBuffer) {
        var readBytesNum = parse(buf, base, visitor);
        base += readBytesNum;
      }
    } catch (err) {
      if (err.message !== _Error.BufferReadError.ERROR_MESSAGE) {
        console.error('IsoBmff.transform: An error occurred in parsing the buffer: ' + err.stack);
      }
      done(null, null);
      return;
    }

    while (stack.length) {
      var _stack = stack[stack.length - 1];
      var type = _stack.type;
      var props = _stack.props;
      var children = _stack.children;

      var result = visitor.exit(type, props, children);
      stack.pop();
      if (result && stack.length > 0) {
        stack[stack.length - 1].children.push(result);
      }
    }
    done(null, null);
  });
}

exports.default = {
  createElement: createElement,
  createElementFromBuffer: createElementFromBuffer,
  transform: transform,
  BoxVisitor: _BoxVisitor2.BoxVisitor,
  IsoBmffDumpVisitor: _BoxVisitor2.IsoBmffDumpVisitor
};