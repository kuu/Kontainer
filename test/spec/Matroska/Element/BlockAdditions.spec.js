import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('BlockAdditions', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  let value = [
        117, 161, 67, 255, // EBML-id [75][A1], size=1022 [43][ff]
        166, 64, 11, // EBML-id [A6], size=11 [04][0b]
        238, 130, 1, 244, // EBML-id [EE], size=2 [82], id=500 [01][f4]
        165, 133, 1, 2, 3, 4, 5, // EBML-id [A5], size=5 [85], data=[1,2,3,4,5]
        166, 67, 238, // EBML-id [A6], size=1006 [43][EE]
        238, 129, 1, // EBML-id [EE], size=1 [81], id=1 [1]
        165, 67, 232, // EBML-id [A5], size=1000 [43][e8]
      ];

  const data = (new Array(1000)).fill(1);

  value = value.concat(data);

  it('should parse/serialize the BlockAdditions element', () => {
    const buf = new Buffer([1, 2, 3, 4, 5]).getView();
    const element1 = <BlockAdditions>
      <BlockMore>
        <BlockAddID value={500} />
        <BlockAdditional value={buf} />
      </BlockMore>
      <BlockMore>
        <BlockAddID value={1} />
        <BlockAdditional value={new Buffer(data).getView()} />
      </BlockMore>
    </BlockAdditions>;
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
