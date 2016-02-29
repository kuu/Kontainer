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
    if (global && global.Buffer && buf instanceof global.Buffer) {
      return buf;
    } else {
      return buf.buffer;
    }
  }
}

module.exports = Buffer;
