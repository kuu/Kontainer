var Box = require('./Box');

class FullBox extends Box {
  constructor(type, props, version, flags) {
    super(type, props);
    this.version = version; // unsigned int(8)
    this.flag = flags; // bit(24)
  }
}

module.exports = FullBox;
