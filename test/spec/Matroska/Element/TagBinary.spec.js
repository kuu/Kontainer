import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('TagBinary', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
      ];

  it('should parse/serialize the TagBinary element', () => {
    const element1 = <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
