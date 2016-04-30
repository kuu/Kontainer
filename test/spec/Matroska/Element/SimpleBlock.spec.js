import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('SimpleBlock', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  let value = [
        163, 73, 7, // EBML-id [A3], size=11+800+500+1000=2311 [49][07]
        33, 0, 0, // Track Number=65536
        0, 33, // Timecode=33 (ms)
        97, // Keyframe=true, Invisible=false, Lacing=EBML, Discardable=false
        2, // Number of frames in the lace-1
        67, 32, 126, 212, // Lacing sizes=[800, 500, 1000]
      ];

  const frame1 = (new Array(800)).fill(1);
  const frame2 = (new Array(500)).fill(2);
  const frame3 = (new Array(1000)).fill(3);

  value = value.concat(frame1, frame2, frame3);

  it('should parse/serialize the SimpleBlock element', () => {
    const element1 = <SimpleBlock {...{
      trackNumber: 65536,
      timecode: 33,
      flags: {keyframe: true, invisible: false, discardable: false},
      frames: [new Buffer(frame1).getView(), new Buffer(frame2).getView(), new Buffer(frame3).getView()]
    }} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    /*
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    */
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
