import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('Cluster', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const frame = (new Array(63)).fill(1);
  const data = (new Array(1000)).fill(1);

  let value = [
        31, 67, 182, 117, 16, 0, 9, 83, // EBML-id [1F][43][B6][75], size=6+5+71+71+1117+1117=2387 [10][00][09][53]
        231, 132, 255, 255, 255, 255, // EBML-id [E7], size=4 [84], timestamp=4294967295
        171, 131, 1, 0, 0, // EBML-id [ab], size=3 [83], version=65536
      ];

  let simpleBlock = [
        163, 197, // EBML-id [A1], size=6+63=69 [C5]
        254, // Track Number=126
        0, 33, // Timecode=33 (ms)
        134, // Keyframe=true, Invisible=false, Lacing=EBML, Discardable=false
        0, // Number of frames in the lace-1
        191, // Lacing sizes=63 [BF]
      ];

  simpleBlock = simpleBlock.concat(frame);

  value = value.concat(simpleBlock, simpleBlock);

  let blockGroup = [
        160, 68, 90, // EBML-id [A0], size=71+1027+16=1114 [44][5A]
      ];

  let block = [
        161, 197, // EBML-id [A1], size=6+63=69 [C5]
        254, // Track Number=126
        0, 33, // Timecode=33 (ms)
        14, // Invisible=true, Lacing=EBML
        0, // Number of frames in the lace-1
        191, // Lacing sizes=63 [BF]
      ];

  block = block.concat(frame);

  let blockAdditions = [
        117, 161, 67, 255, // EBML-id [75][A1], size=1023 [43][ff]
        166, 64, 11, // EBML-id [A6], size=11 [04][0b]
        238, 130, 1, 244, // EBML-id [EE], size=2 [82], id=500 [01][f4]
        165, 133, 1, 2, 3, 4, 5, // EBML-id [A5], size=5 [85], data=[1,2,3,4,5]
        166, 67, 238, // EBML-id [A6], size=1006 [43][EE]
        238, 129, 1, // EBML-id [EE], size=1 [81], id=1 [1]
        165, 67, 232, // EBML-id [A5], size=1000 [43][e8]
      ];

  blockAdditions = blockAdditions.concat(data);

  const others = [
        155, 130, 2, 148, // EBML-id [9B], size=2 [82], duration=660 [02][94]
        251, 129, 33, // EBML-id [FB], size=1 [81], relative timestamp=33 [21]
        251, 129, 33, // EBML-id [FB], size=1 [81], relative timestamp=33 [21]
        117, 162, 131, 255, 0, 0, // EBML-id [75][A2], size=1 [83], padding=-65536 [FF][00][00]
      ];

  blockGroup = blockGroup.concat(block, blockAdditions, others);

  value = value.concat(blockGroup, blockGroup);

  it('should parse/serialize the Cluster element', () => {
    const buf = new Buffer([1, 2, 3, 4, 5]).getView();
    const element1 = <Cluster>
      <Timecode value={4294967295} />
      <PrevSize value={65536} />
      <SimpleBlock {...{
        trackNumber: 126,
        timecode: 33,
        flags: {keyframe: true, invisible: false, discardable: false},
        frames: [new Buffer(frame).getView()]
      }} />
      <SimpleBlock {...{
        trackNumber: 126,
        timecode: 33,
        flags: {keyframe: true, invisible: false, discardable: false},
        frames: [new Buffer(frame).getView()]
      }} />
      <BlockGroup>
        <Block {...{
          trackNumber: 126,
          timecode: 33,
          flags: {invisible: true},
          frames: [new Buffer(frame).getView()]
        }} />
        <BlockAdditions>
          <BlockMore>
            <BlockAddID value={500} />
            <BlockAdditional value={buf} />
          </BlockMore>
          <BlockMore>
            <BlockAddID value={1} />
            <BlockAdditional value={new Buffer(data).getView()} />
          </BlockMore>
        </BlockAdditions>
        <BlockDuration value={660} />
        <ReferenceBlock value={33} />
        <ReferenceBlock value={33} />
        <DiscardPadding value={-65536} />
      </BlockGroup>
      <BlockGroup>
        <Block {...{
          trackNumber: 126,
          timecode: 33,
          flags: {invisible: true},
          frames: [new Buffer(frame).getView()]
        }} />
        <BlockAdditions>
          <BlockMore>
            <BlockAddID value={500} />
            <BlockAdditional value={buf} />
          </BlockMore>
          <BlockMore>
            <BlockAddID value={1} />
            <BlockAdditional value={new Buffer(data).getView()} />
          </BlockMore>
        </BlockAdditions>
        <BlockDuration value={660} />
        <ReferenceBlock value={33} />
        <ReferenceBlock value={33} />
        <DiscardPadding value={-65536} />
      </BlockGroup>
    </Cluster>;
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
