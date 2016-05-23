import {TransformStream} from '../../../src/core/Stream';
import CoreBuffer from '../../../src/core/Buffer';

describe('Stream', () => {
  describe('TransformStream', () => {
    let InputStream;
    let OutputStream;
    let sourceBuffer;

    if (global && global.Buffer) {
      const streams = require('stream');
      const Readable = streams.Readable;
      const Writable = streams.Writable;

      class NodeInputStream extends Readable {
        constructor(options) {
          super(options);
          this.finished = false;
          this.count = 0;
        }
      }

      class NodeOutputStream extends Writable {
        constructor(cb, options) {
          super(options);
          this.data = null;
          this.on('finish', () => {
            const data = this.data;
            expect(data.length).toEqual(sourceBuffer.length);
            for (let i = 0; i < data.length; i++) {
              expect(data[i]).toEqual(sourceBuffer[i] * 2);
            }
            cb();
          });
        }

        _write(chunk, encoding, done) {
          if (this.data) {
            this.data = Buffer.concat([this.data, chunk]);
          } else {
            this.data = chunk;
          }
          done();
        }
      }

      InputStream = NodeInputStream;
      OutputStream = NodeOutputStream;

      sourceBuffer = new Buffer(256);
      for (let i = 0; i < 256; i++) {
        sourceBuffer[i] = Math.floor(i / 2);
      }
    } else {
      // TODO WhatWG's streams
    }

    let transform;

    beforeEach(() => {

      transform = new TransformStream((buffer, offset, done) => {
        const length = buffer.getLength();
        const doubled = new CoreBuffer(length - offset);
        const oldBuf = buffer.getData();
        const newBuf = doubled.getData();
        for (let i = offset; i < length; i++) {
          newBuf[i - offset] = oldBuf[i] * 2;
        }
        done('done', doubled);
      });
    });

    it('can transform data', (cb) => {
      if (global && global.Buffer) {
        InputStream.prototype._read = function (size) {
          if (this.finished) {
            this.push(null);
          } else {
            this.push(sourceBuffer);
            this.finished = true;
          }
        };

        const input = new InputStream();
        const output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      } else {
        // TODO (WhatWG's streams)
      }
    });

    it('can pause and resume', (cb) => {
      if (global && global.Buffer) {
        InputStream.prototype._read = function (size) {
          const count = this.count;
          if (count === 2) {
            this.push(null);
          } else {
            if (count === 0) {
              this.push(sourceBuffer.slice(0, 128));
            } else {
              this.push(sourceBuffer.slice(128, 256));
            }
            this.count++;
          }
        };

        const input = new InputStream();
        const output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      } else {
        // TODO (WhatWG's streams)
      }
    });
  });
});
