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
}
