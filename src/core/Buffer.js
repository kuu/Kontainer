export default class Buffer {
  constructor(param) {
    if (global && global.Buffer) {
      this.buffer = new global.Buffer(param);
    } else {
      this.buffer = new Uint8Array(param);
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
