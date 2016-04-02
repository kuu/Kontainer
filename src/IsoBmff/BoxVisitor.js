import Visitor from '../core/Visitor';

export class BoxVisitor extends Visitor {
  enter (type, props) {
    // To be overriddedn
  }

  exit (type, props, children) {
    // To be overriddedn
  }
}

export class IsoBmffDumpVisitor extends BoxVisitor {
  static formatBuffer(v) {
    if (global && global.Buffer) {
      return `[Buffer length=${v.length}]`;
    }
    return v;
  }

  static isBuffer(v) {
    if (global && global.Buffer) {
      return (v instanceof global.Buffer);
    }
    return (v instanceof ArrayBuffer);
  }

  static padding(num) {
    var str = '';
    for (var i = 0; i < num; i++) {
      str += '\t';
    }
    return str;
  }

  static formatValue(v) {
    var str;
    if (typeof v === 'object' && !(v instanceof Date) && !IsoBmffDumpVisitor.isBuffer(v)) {
      str = '{';
      Object.keys(v).forEach(key => {
        str += (key + ': ' + IsoBmffDumpVisitor.formatValue(v[key]) + ', ');
      });
      return str + '}';
    }
    if (typeof v === 'string') {
      return '"' + v + '"';
    }
    if (IsoBmffDumpVisitor.isBuffer(v)) {
      return IsoBmffDumpVisitor.formatBuffer(v);
    }
    return v;
  }

  static formatArray(a) {
    var str = '[ ';
    if (a.length > 100) {
      return str + `array of length=${a.length}]`;
    }
    a.forEach(v => {
      if (v instanceof Array) {
        str += IsoBmffDumpVisitor.formatArray(v);
      } else {
        str += IsoBmffDumpVisitor.formatValue(v);
      }
      str += ', ';
    });
    return str + ' ]';
  }

  enter(type, props) {
    const depth = this.depth();
    console.log(`${IsoBmffDumpVisitor.padding(depth)}[${type.COMPACT_NAME}] >>>> start`);
    Object.keys(props).forEach((key) => {
      let value = props[key];
      if (value instanceof Array) {
        value = IsoBmffDumpVisitor.formatArray(value);
      } else {
        value = IsoBmffDumpVisitor.formatValue(value);
      }
      console.log(`${IsoBmffDumpVisitor.padding(depth)}\t${key}: ${value}`);
    });
  }

  exit(type) {
    const depth = this.depth();
    console.log(`${IsoBmffDumpVisitor.padding(depth)}[${type.COMPACT_NAME}] <<<< end`);
  }
}
