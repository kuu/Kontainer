class Buffer {
  constructor(length) {
    if (global && global.Buffer) {
      this.buffer = new global.Buffer(length);
    } else {
      this.buffer = new Uint8Array(length);
    }
  }

  getView() {
    return this.buffer;
  }

  getData() {
    var buf = this.buffer;
    if (buf instanceof Uint8Array) {
      return buf.buffer;
    } else {
      return buf;
    }
  }
}

module.exports = Buffer;
