import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('Block', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  let value = [
        161, 197, // EBML-id [A1], size=6+63=69 [C5]
        254, // Track Number=126
        0, 33, // Timecode=33 (ms)
        112, // Invisible=true, Lacing=EBML
        0, // Number of frames in the lace-1
        191, // Lacing sizes=63 [BF]
      ];

  const frame1 = (new Array(63)).fill(1);

  value = value.concat(frame1);

  it('should parse/serialize the Block element', () => {
    const element1 = <Block {...{
      trackNumber: 126,
      timecode: 33,
      flags: {invisible: true},
      frames: [new Buffer(frame1).getView()]
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
