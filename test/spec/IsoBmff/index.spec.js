import Kontainer from '../../../src/';
import Buffer from '../../../src/core/Buffer';
import {Visitor} from '../../../src/core/Visitor';
import sample from '../../helper/IsoBmff';
import customMatchers from '../../helper/matcher';

const IsoBmff = Kontainer.IsoBmff;
const ELEMENT = sample.element;
const BUFFER = sample.buffer;
const ELEMENT_NUM = 22;

describe('IsoBmff', () => {

  describe('querySelector', () => {

    it('can find the root node', () => {
      const root = ELEMENT.querySelector('file');
      expect(root.type.COMPACT_NAME).toEqual('file');
    });

    it('can find a leaf node', () => {
      const leaf = ELEMENT.querySelector('avcC');
      expect(leaf.type.COMPACT_NAME).toEqual('avcC');
    });

    it('can find a middle node', () => {
      const mid = ELEMENT.querySelector('mdia');
      expect(mid.type.COMPACT_NAME).toEqual('mdia');
    });

    it('can search a partial tree', () => {
      const mid = ELEMENT.querySelector('trak');
      const leaf = mid.querySelector('urn ');
      expect(leaf.type.COMPACT_NAME).toEqual('urn ');
    });
  });

  if (global && global.Buffer) {
    // Node only
    describe('transform', () => {

      const streams = require('stream');
      const Readable = streams.Readable;
      const Writable = streams.Writable;
      const buffer = (new Buffer(BUFFER)).getData();

      const fakeFuncs = {
        visitCounter () {},
      };

      beforeEach(() => {
        spyOn(fakeFuncs, 'visitCounter');
      });

      class InputStream extends Readable {
        constructor(options) {
          super(options);
          this.finished = false;
          this.count = 0;
        }
      }

      class OutputStream extends Writable {
        constructor(cb, options) {
          super(options);
          this.data = null;
          this.on('finish', () => {
            expect(fakeFuncs.visitCounter.calls.count()).toEqual(ELEMENT_NUM);
            cb();
          });
        }

        _write(chunk, encoding, done) {
          done();
        }
      }

      class TestVisitor extends Visitor {
        constructor() {
          super();
          this.expectedStackLength = 0;
        }

        enter(...params) {
          super.enter(...params);
          this.expectedStackLength++;
        }

        exit(...params) {
          super.exit(...params);
          this.expectedStackLength--;
        }

        visit(type, props) {
          fakeFuncs.visitCounter();
          customMatchers.toHaveTheSamePropsAs(ELEMENT.querySelector(type.COMPACT_NAME), {props});
          expect(this.depth()).toEqual(this.expectedStackLength - 1);
        }
      }

      it('can parse full buffer', (cb) => {
        const visitor = new TestVisitor();

        InputStream.prototype._read = function (size) {
          if (this.finished) {
            this.push(null);
          } else {
            this.push(buffer);
            this.finished = true;
          }
        };

        const input = new InputStream();
        const transform = IsoBmff.transform(visitor);
        const output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      });

      it('can pause (just between boxes)', (cb) => {
        const visitor = new TestVisitor();

        InputStream.prototype._read = function (size) {
          const count = this.count;
          if (count === 2) {
            this.push(null);
          } else {
            if (count === 0) {
              this.push(buffer.slice(0, 132));
            } else {
              this.push(buffer.slice(132, buffer.length));
            }
            this.count++;
          }
        };

        const input = new InputStream();
        const transform = IsoBmff.transform(visitor);
        const output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      });

      it('can pause (in the middle of box)', (cb) => {
        const visitor = new TestVisitor();

        InputStream.prototype._read = function (size) {
          const count = this.count;
          if (count === 2) {
            this.push(null);
          } else {
            if (count === 0) {
              this.push(buffer.slice(0, 172));
            } else {
              this.push(buffer.slice(172, buffer.length));
            }
            this.count++;
          }
        };

        const input = new InputStream();
        const transform = IsoBmff.transform(visitor);
        const output = new OutputStream(cb);
        input.pipe(transform).pipe(output);
      });

      class ElementOutputStream extends Writable {
        constructor(cb, options) {
          super(options);
          this.data = null;
          this.on('finish', () => {
            expect(this.data instanceof global.Buffer).toEqual(true);
            expect(this.data.length).toEqual(BUFFER.length);
            cb();
          });
        }

        _write(chunk, encoding, done) {
          if (chunk && chunk instanceof global.Buffer) {
            if (this.data) {
              this.data = global.Buffer.concat([this.data, chunk]);
            } else {
              this.data = chunk;
            }
          }
          done();
        }
      }

      it('can convert buffer to element and revert it back', (cb) => {
        const visitor = new IsoBmff.ElementVisitor();

        InputStream.prototype._read = function (size) {
          if (this.finished) {
            this.push(null);
          } else {
            this.push(buffer);
            this.finished = true;
          }
        };

        const input = new InputStream();
        const transform = IsoBmff.transform(visitor);
        const output = new ElementOutputStream(cb);
        input.pipe(transform).pipe(output);
      });
    });
  }
});
