export default class Buffer {
  constructor(...params) {
    if (global && global.Buffer) {
      this.buffer = new global.Buffer(...params);
    } else {
      if (params.length === 1 && params[0] && typeof params[0][Symbol.iterator] === 'function') {
        this.buffer = Uint8Array.from(params[0]);
      } else {
        this.buffer = new Uint8Array(...params);
      }
    }
  }

  static wrap(buffer) {
    const buf = new Buffer(0);
    buf.buffer = buffer;
    return buf;
  }

  getView() {
    return this.buffer;
  }

  getData() {
    const buf = this.buffer;
    if (global && global.Buffer && buf instanceof global.Buffer) {
      return buf;
    } else {
      return buf.buffer;
    }
  }

  getLength() {
    if (global && global.Buffer) {
      return this.buffer.length;
    } else {
      return this.buffer.byteLength;
    }
  }

  copy(start, length) {
    if (global && global.Buffer) {
      let buf = new global.Buffer(length);
      this.buffer.copy(buf, 0, start, start + length);
      return Buffer.wrap(buf);
    } else {
      return Buffer.wrap(this.buffer.slice(start, start + length));
    }
  }

  copyFrom(src, srcOffset, length, thisOffset=0) {
    if (global && global.Buffer) {
      src.copy(this.buffer, thisOffset, srcOffset, srcOffset + length);
    } else {
      this.buffer.subarray(thisOffset, thisOffset + length).set(src, srcOffset);
    }
  }
}
