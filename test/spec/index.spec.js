import Kontainer from 'kontainer-js';
import testDataMp4 from '../helper/IsoBmff';
import testDataWebM from '../helper/Matroska';
import Buffer from '../../src/core/Buffer';

describe('Kontainer', () => {

  it('should be able to detect mp4/webm', () => {
    const bufMp4 = testDataMp4.buffer;
    expect(Kontainer.checkContainerFormat(bufMp4)).toBe('mp4');

    const bufWebm = [
      26, 69, 223, 163, 16, 0, 0, 31, // EBML id [1A][45][DF][A3], size=31 [10][00][00][1F]
      66, 134, 129, 1, // EBMLVersion id [42][86], size=1 [81], version=1
      66, 247, 129, 1, // EBMLReadVersion id [42][F7], size=1 [81], version=1
      66, 242, 129, 4, // EBMLMaxIDLength id [42][F2], size=1 [81], max id length=4
      66, 243, 129, 8, // EBMLMaxSizeLength id [42][F3], size=1 [81], max size length=8
      66, 130, 132, 119, 101, 98, 109, // DocType id [42][82], size=4 [84], doc type="webm"
      66, 135, 129, 1, // DocTypeVersion id [42][87], size=1 [81], version=1
      66, 133, 129, 1, // DocTypeReadVersion id [42][85], size=1 [81], version=1
    ];
    expect(Kontainer.checkContainerFormat(bufWebm)).toBe('webm');
  });

  it('can ingore unknown boxes', () => {

    const UNKNOWN_BOX_NAME = '    ';
    const unknownValue = [
          0, 0, 0, 40, // size=40
          109, 105, 110, 102, // type='minf'
          0, 0, 0, 16, // size=16
          32, 32, 32, 32, // type=(unknown)
          1, 2, 4, 8,
          16, 32, 64, 128,
          0, 0, 0, 16, // size=16
          100, 114, 101, 102, // type='dref'
          0, 0, 0, 0, // version=0, flags=0
          0, 0, 0, 0, // entry_count=0
        ];

    const element1 = Kontainer.createElementFromBuffer((new Buffer(unknownValue)).getData(), 0, {ignoreUnknown: false});
    expect(element1).not.toBe(null);
    expect(element1.querySelector(UNKNOWN_BOX_NAME)).not.toBe(null);
    const element2 = Kontainer.createElementFromBuffer((new Buffer(unknownValue)).getData(), 0, {ignoreUnknown: true});
    expect(element2).not.toBe(null);
    expect(element2.querySelector(UNKNOWN_BOX_NAME)).toBe(null);
  });

  it('should be able to provide its MIME type', () => {
    const audioOnlyMP4 = Kontainer.render(testDataMp4.audioOnly);
    const audioVideoMP4 = Kontainer.render(testDataMp4.fullAV);
    const audioOnlyWebM = Kontainer.render(testDataWebM.audioOnly);
    const audioVideoWebM = Kontainer.render(testDataWebM.fullAV);

    const element1 = Kontainer.createElementFromBuffer(audioOnlyMP4);
    expect(element1).not.toBe(null);
    expect(element1.getMimeType()).toEqual('audio/mp4');
    const element2 = Kontainer.createElementFromBuffer(audioVideoMP4);
    expect(element2).not.toBe(null);
    expect(element2.getMimeType()).toEqual('video/mp4');
    const element3 = Kontainer.createElementFromBuffer(audioOnlyWebM);
    expect(element3).not.toBe(null);
    expect(element3.getMimeType()).toEqual('audio/webm');
    const element4 = Kontainer.createElementFromBuffer(audioVideoWebM);
    expect(element4).not.toBe(null);
    expect(element4.getMimeType()).toEqual('video/webm');
  });

  it('should be able to handle "location-free" elements', () => {
    const nestedCluster = (
      <Cluster>
        <Timecode value={4294967295} />
        <Cluster>
          <Timecode value={4294967295} />
          <PrevSize value={65536} />
          <SimpleBlock {...{
            trackNumber: 126,
            timecode: 33,
            flags: {keyframe: true, invisible: false, discardable: false},
            frames: [new Buffer([1, 2, 3, 4, 5]).getView()]
          }}>
            <Void value={new Buffer([1, 2, 3, 4, 5]).getView()} />
          </SimpleBlock>
        </Cluster>
      </Cluster>
    );
    expect(nestedCluster).not.toBe(null);
  });

  if (global && global.Buffer) {
    it('should be able to handle asynchronous transformations', (callback) => {
      const fakeFuncs = {
        formatCounter() {},
        fulfillCounter() {},
      };
      spyOn(fakeFuncs, 'formatCounter');
      spyOn(fakeFuncs, 'fulfillCounter');

      const stream = require('stream');
      class OutputStream extends stream.Writable {
        constructor(cb, options) {
          super(options);
          this.on('finish', () => {
            expect(fakeFuncs.formatCounter.calls.count()).toEqual(1);
            expect(fakeFuncs.fulfillCounter.calls.count()).toEqual(1);
            cb();
          });
        }

        _write(chunk, encoding, done) {
          done();
        }
      }
      const output = new OutputStream(callback);

      const promise = Promise.resolve();
      promise.then(() => {
        fakeFuncs.fulfillCounter();
      });

      const transform = Kontainer.transform((type, props, children) => {
        ;
      }, {until: promise});

      transform.on('format', (format) => {
        fakeFuncs.formatCounter();
      });

      const bufMp4 = testDataMp4.buffer;
      const input = new stream.PassThrough();
      input.end(new Buffer(testDataMp4.buffer).getData());
      input.pipe(transform).pipe(output);
    });
  }
});
