import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('BlockMore', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        166, 64, 11, // EBML-id [A6], size=11 [40][0b]
        238, 130, 1, 244, // EBML-id [EE], size=2 [82], id=500 [41][f4]
        165, 133, 1, 2, 3, 4, 5, // EBML-id [A5], size=5 [85], data=[1,2,3,4,5]
      ];

  it('should parse/serialize the BlockMore element', () => {
    const buf = new Buffer([1, 2, 3, 4, 5]).getView();
    const element1 = <BlockMore>
      <BlockAddID value={500} />
       <BlockAdditional value={buf} />
    </BlockMore>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
