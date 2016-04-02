import IsoBmff from './IsoBmff';
import PropTypes from './core/PropTypes';
import Reader from './core/Reader';
import Writer from './core/Writer';
import Buffer from './core/Buffer';

function traverse(context, element, buffer, offset=0) {
  let type, props, children, instance,
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
  const indent = context.indent;
  const formatter = context.formatter;

  let type, props, children;

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
  let size, buffer, context = {};

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

const defaultPropsFormatter = {
  buffer: (v) => {
    if (global && global.Buffer) {
      return `[Buffer length=${v.length}]`;
    }
    return v;
  },
  isBuffer: (v) => {
    if (global && global.Buffer) {
      return (v instanceof global.Buffer);
    }
    return (v instanceof ArrayBuffer);
  },
  padding: (num) => {
    let str = '';
    for (let i = 0; i < num; i++) {
      str += '\t';
    }
    return str;
  },
  value: (v) => {
    let str;
    if (typeof v === 'object' && !(v instanceof Date) && !defaultPropsFormatter.isBuffer(v)) {
      str = '{';
      Object.keys(v).forEach(key => {
        str += (key + ': ' + defaultPropsFormatter.value(v[key]) + ', ');
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
  array: (a) => {
    let str = '[ ';
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
    let v;
    if (value instanceof Array) {
      v = defaultPropsFormatter.array(value);
    } else {
      v = defaultPropsFormatter.value(value);
    }
    return defaultPropsFormatter.padding(indentNum) + '\t' + key + ': ' + v + '\n';
  }
};

function renderToString(element, propsFormatter) {
  const context = {
    string: '',
    indent: 0,
    formatter: propsFormatter || defaultPropsFormatter
  };
  printProps(context, element);
  return context.string;
}

export default {
  renderToBuffer,
  renderToString,
  IsoBmff,
  PropTypes,
  Reader,
  Writer
};
