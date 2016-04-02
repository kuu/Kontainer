'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _IsoBmff = require('./IsoBmff');

var _IsoBmff2 = _interopRequireDefault(_IsoBmff);

var _PropTypes = require('./core/PropTypes');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

var _Reader = require('./core/Reader');

var _Reader2 = _interopRequireDefault(_Reader);

var _Writer = require('./core/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Buffer = require('./core/Buffer');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function traverse(context, element, buffer) {
  var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

  var type = undefined,
      props = undefined,
      children = undefined,
      instance = undefined,
      propTypes = undefined,
      base = offset,
      err = undefined;

  if (!element) {
    console.warn('Kontainer.renderToBuffer: null element.');
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
      if (!Object.keys(propTypes).every(function (key) {
        err = propTypes[key](props, key, type.COMPACT_NAME);
        if (err) {
          return false;
        }
        return true;
      })) {
        console.error('Kontainer.renderToBuffer: Prop validation failed: ' + err.message);
        return 0;
      }
    }
    // Validate context
    err = type.validate(context, props);
    if (err) {
      console.error('Kontainer.renderToBuffer: Context validation failed: ' + err.message);
    }
    // Instantiation
    instance = element.instance = new type(props);
  }

  // Write self to the array buffer.
  base += instance.serialize(buffer, offset);

  // Write children to the array buffer.
  children.forEach(function (child) {
    base += traverse(context, child, buffer, base);
  });

  // Update the size.
  instance.setSize(base - offset, buffer, offset);

  //console.log(`traverse exit. type=${type.COMPACT_NAME} size=${instance.getSize()}`);
  return instance.getSize();
}

function printProps(context, element) {
  var indent = context.indent;
  var formatter = context.formatter;

  var type = undefined,
      props = undefined,
      children = undefined;

  if (!element) {
    console.warn('Kontainer.renderToString: null element.');
    return;
  }

  type = element.type;
  props = element.props;
  children = props.children;

  //console.log(`printProps enter. type=${type.COMPACT_NAME}`);

  context.string += formatter.header(indent, type.COMPACT_NAME);

  // Write self to the string.
  Object.keys(props).forEach(function (key) {
    if (key === 'children' || key === 'type') {
      return;
    }
    if (key === 'extendedType' && props.type !== 'uuid') {
      return;
    }
    context.string += formatter.body(indent, key, props[key]);
  });

  // Write children to the array buffer.
  context.indent++;
  children.forEach(function (child) {
    printProps(context, child);
  });

  context.indent--;
  context.string += formatter.footer(indent, type.COMPACT_NAME);

  //console.log(`printProps exit. type=${type.COMPACT_NAME}`);
}

function renderToBuffer(element) {
  var size = undefined,
      buffer = undefined,
      context = {};

  // Culculate the entire byte size.
  size = traverse(context, element);

  if (!size) {
    return null;
  }

  // Write to the array buffer.
  buffer = new _Buffer2.default(size);
  traverse(context, element, buffer.getView());

  return buffer.getData();
}

var defaultPropsFormatter = {
  buffer: function buffer(v) {
    if (global && global.Buffer) {
      return '[Buffer length=' + v.length + ']';
    }
    return v;
  },
  isBuffer: function isBuffer(v) {
    if (global && global.Buffer) {
      return v instanceof global.Buffer;
    }
    return v instanceof ArrayBuffer;
  },
  padding: function padding(num) {
    var str = '';
    for (var i = 0; i < num; i++) {
      str += '\t';
    }
    return str;
  },
  value: function value(v) {
    var str = undefined;
    if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && !(v instanceof Date) && !defaultPropsFormatter.isBuffer(v)) {
      str = '{';
      Object.keys(v).forEach(function (key) {
        str += key + ': ' + defaultPropsFormatter.value(v[key]) + ', ';
      });
      return str + '}';
    }
    if (typeof v === 'string') {
      return '"' + v + '"';
    }
    if (defaultPropsFormatter.isBuffer(v)) {
      return defaultPropsFormatter.buffer(v);
    }
    return v;
  },
  array: function array(a) {
    var str = '[ ';
    if (a.length > 100) {
      return str + ('array of length=' + a.length + ']');
    }
    a.forEach(function (v) {
      if (v instanceof Array) {
        str += defaultPropsFormatter.array(v);
      } else {
        str += defaultPropsFormatter.value(v);
      }
      str += ', ';
    });
    return str + ' ]';
  },
  header: function header(indentNum, typeName) {
    return defaultPropsFormatter.padding(indentNum) + '[' + typeName + '] >>>> start' + '\n';
  },
  footer: function footer(indentNum, typeName) {
    return defaultPropsFormatter.padding(indentNum) + '[' + typeName + '] <<<< end' + '\n';
  },
  body: function body(indentNum, key, value) {
    var v = undefined;
    if (value instanceof Array) {
      v = defaultPropsFormatter.array(value);
    } else {
      v = defaultPropsFormatter.value(value);
    }
    return defaultPropsFormatter.padding(indentNum) + '\t' + key + ': ' + v + '\n';
  }
};

function renderToString(element, propsFormatter) {
  var context = {
    string: '',
    indent: 0,
    formatter: propsFormatter || defaultPropsFormatter
  };
  printProps(context, element);
  return context.string;
}

exports.default = {
  renderToBuffer: renderToBuffer,
  renderToString: renderToString,
  IsoBmff: _IsoBmff2.default,
  PropTypes: _PropTypes2.default,
  Reader: _Reader2.default,
  Writer: _Writer2.default
};