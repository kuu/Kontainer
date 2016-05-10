import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('BlockGroup', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const frame1 = (new Array(63)).fill(1);
  const frame2 = (new Array(800)).fill(2);
  const frame3 = (new Array(500)).fill(3);
  const frame4 = (new Array(1000)).fill(4);

  let value = [
        160, 73, 81, // EBML-id [A0], size=2385 [49][51]
      ];

  let value2 = [
        161, 197, // EBML-id [A1], size=6+63=69 [C5]
        254, // Track Number=126
        0, 33, // Timecode=33 (ms)
        14, // Invisible=true, Lacing=EBML
        0, // Number of frames in the lace-1
        191, // Lacing sizes=63 [BF]
      ];

  value2 = value2.concat(frame1);

  let value3 = [
        161, 73, 7, // EBML-id [A1], size=11+800+500+1000=2311 [49][07]
        33, 0, 0, // Track Number=65536
        0, 33, // Timecode=33 (ms)
        6, // Invisible=false, Lacing=EBML
        2, // Number of frames in the lace-1
        67, 32, 94, 211, // Lacing sizes=[800, 500, 1000]
      ];

  value3 = value3.concat(frame2, frame3, frame4);

  value = value.concat(value2, value3);

  it('should parse/serialize the BlockGroup element', () => {
    const element1 = <BlockGroup>
      <Block {...{
        trackNumber: 126,
        timecode: 33,
        flags: {invisible: true},
        frames: [new Buffer(frame1).getView()]
      }} />
      <Block {...{
        trackNumber: 65536,
        timecode: 33,
        flags: {invisible: false},
        frames: [new Buffer(frame2).getView(), new Buffer(frame3).getView(), new Buffer(frame4).getView()]
      }} />;
    </BlockGroup>;
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
