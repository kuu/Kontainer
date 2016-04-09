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
    return v + '';
  }

  static isBuffer(v) {
    if (global && global.Buffer) {
      return (v instanceof global.Buffer);
    }
    return (v instanceof ArrayBuffer);
  }

  static padding(num) {
    let str = '';
    for (let i = 0; i < num; i++) {
      str += '\t';
    }
    return str;
  }

  static formatValue(v) {
    if (v instanceof Date) {
      return v + '';
    } else if (IsoBmffDumpVisitor.isBuffer(v)) {
      return IsoBmffDumpVisitor.formatBuffer(v);
    } else if (typeof v === 'object') {
      const arr = [];
      Object.keys(v).forEach(key => {
        arr.push(key + ': ' + IsoBmffDumpVisitor.formatValue(v[key]));
      });
      return `{${arr.join(', ')}}`;
    } else if (typeof v === 'string') {
      return '"' + v + '"';
    }
    return v;
  }

  static formatArray(a) {
    if (a.length > 100) {
      return `[array of length=${a.length}]`;
    }
    const arr = [];
    a.forEach(v => {
      if (v instanceof Array) {
        arr.push(IsoBmffDumpVisitor.formatArray(v));
      } else {
        arr.push(IsoBmffDumpVisitor.formatValue(v));
      }
    });
    return `[${arr.join(', ')}]`;
  }

  enter(type, props) {
    const depth = this.depth();
    console.log(`${IsoBmffDumpVisitor.padding(depth)}[${type.COMPACT_NAME}] >>>> start`);
    Object.keys(props).forEach(key => {
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
