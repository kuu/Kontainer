import Buffer from './Buffer';

let TransformStream;

if (global && global.Buffer) {
  const Transform = require('stream').Transform;

  class NodeTransform extends Transform {
    constructor(parser, options) {
      super(options);
      this.buffer = null;
      this.offset = 0;
      this.parser = parser;
    }

    _transform(chunk, encoding, done) {
      if (chunk instanceof global.Buffer) {
        if (this.buffer) {
          this.offset = this.buffer.length;
          this.buffer = global.Buffer.concat([this.buffer, chunk]);
        } else {
          this.buffer = chunk;
        }
        this.parser(new Buffer(this.buffer), this.offset, (err, buf) => {
          done(err, buf && buf.getData());
        });
      }
    }

    _flush(done) {
      done();
    }
  }

  TransformStream = NodeTransform;
} else {
  // TODO (WhatWG's streams)
}

export {
  TransformStream
}
