import Buffer from './Buffer';

export let TransformStream;

if (global && global.Buffer) {
  const Transform = require('stream').Transform;

  class NodeTransform extends Transform {
    constructor(parser, options={}) {
      super(options);
      this.buffer = null;
      this.offset = 0;
      this.parser = parser;
      this.options = options;
    }

    _transform(chunk, encoding, done) {
      if (chunk instanceof global.Buffer) {
        if (this.buffer) {
          this.offset = this.buffer.length;
          this.buffer = global.Buffer.concat([this.buffer, chunk]);
        } else {
          this.buffer = chunk;
        }
        this.parser(new Buffer(this.buffer), this.offset, (event, param) => {
          if (event === 'done') {
            let b;
            if (param && param instanceof Buffer) {
              b = param.getData();
            } else {
              b = param;
            }
            done(null, b);
          } else {
            this.emit(event, param);
          }
        });
      }
    }

    _flush(done) {
      done();
    }

    setOptions(options) {
      Object.assign(this.options, options);
    }
  }

  TransformStream = NodeTransform;
} else {
  // TODO (WhatWG's streams)
}
