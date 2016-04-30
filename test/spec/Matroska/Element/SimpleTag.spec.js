import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('SimpleTag', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
      ];

  it('should parse/serialize the SimpleTag element', () => {
    const element1 = <SimpleTag>
      <TagName value={"Prince"} />
      <TagLanguage value={"jpn"} />
      <TagDefault value={false} />
      <TagString value={"Prince and Revolution"} />
      <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
    </SimpleTag>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
