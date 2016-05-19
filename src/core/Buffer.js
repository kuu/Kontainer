export default class Buffer {
  constructor(...params) {
    if (global && global.Buffer) {
      this.buffer = new global.Buffer(...params);
    } else {
      if (params.length === 1 && params[0] && Array.isArray(params[0])) {
        const array = params[0];
        if (typeof Uint8Array.from === 'function') {
          this.buffer = Uint8Array.from(array);
        } else {
          console.log('mjd?');
          this.buffer = new Uint8Array(array.length);
          for (let i = 0; i < array.length; i++) {
            this.buffer[i] = array[i];
          }
        }
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
