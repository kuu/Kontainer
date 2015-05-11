var IsoBmff = require('./IsoBmff/'),
    PropTypes = require('./core/PropTypes'),
    Writer = require('./core/Writer'),
    Buffer = require('./core/Buffer');

require("babel/polyfill");

function traverse(context, element, buffer, offset=0) {
  var type, props, children, instance,
      propTypes, base = offset, err;

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
      if (!Object.keys(propTypes).every(key => {
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
  children.forEach(child => {
    base += traverse(context, child, buffer, base);
  });

  // Update the size.
  instance.setSize(base - offset, buffer, offset);

  //console.log(`traverse exit. type=${type.COMPACT_NAME} size=${instance.getSize()}`);
  return instance.getSize();
}

function printProps(context, element) {
  var type, props, children,
      indent = context.indent,
      formatter = context.formatter;

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
  Object.keys(props).forEach(key => {
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
  children.forEach(child => {
    printProps(context, child);
  });

  context.indent--;
  context.string += formatter.footer(indent, type.COMPACT_NAME);

  //console.log(`printProps exit. type=${type.COMPACT_NAME}`);
}

function renderToBuffer(element) {
  var size, buffer, context = {};

  // Culculate the entire byte size.
  size = traverse(context, element);

  if (!size) {
    return null;
  }

  // Write to the array buffer.
  buffer = new Buffer(size);
  traverse(context, element, buffer.getView());

  return buffer.getData();
}

var defaultPropsFormatter = {
  padding: (num) => {
    var str = '';
    for (var i = 0; i < num; i++) {
      str += '\t';
    }
    return str;
  },
  value: (v) => {
    var str;
    if (typeof v === 'object' && !(v instanceof Date) && !(v instanceof ArrayBuffer)) {
      str = '{';
      Object.keys(v).forEach(key => {
        str += (key + ': ' + defaultPropsFormatter.value(v[key]) + ', ');
      });
      return str + '}';
    }
    if (typeof v === 'string') {
      return '"' + v + '"';
    }
    return v;
  },
  array: (a) => {
    var str = '[ ';
    if (a.length > 100) {
      return str + `array of length=${a.length}]`;
    }
    a.forEach(v => {
      if (v instanceof Array) {
        str += defaultPropsFormatter.array(v);
      } else {
        str += defaultPropsFormatter.value(v);
      }
      str += ', ';
    });
    return str + ' ]';
  },
  header: (indentNum, typeName) => {
    return defaultPropsFormatter.padding(indentNum) + '[' + typeName + '] >>>> start' + '\n';
  },
  footer: (indentNum, typeName) => {
    return defaultPropsFormatter.padding(indentNum) + '[' + typeName + '] <<<< end' + '\n';
  },
  body: (indentNum, key, value) => {
    var v;
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

module.exports = {
  renderToBuffer: renderToBuffer,
  renderToString: renderToString,
  IsoBmff: IsoBmff,
  PropTypes: PropTypes,
  Writer: Writer
};
