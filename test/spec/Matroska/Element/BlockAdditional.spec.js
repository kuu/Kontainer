import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('BlockAdditional', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        165, 133, 1, 2, 3, 4, 5, // EBML-id [A5], size=5 [85], data=[1,2,3,4,5]
      ];

  it('should parse/serialize the BlockAdditional element', () => {
    const buf = new Buffer([1, 2, 3, 4, 5]).getView();
    const element1 = <BlockAdditional value={buf} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
