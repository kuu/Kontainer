import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('ContentEncKeyID', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        71, 226, 133, 1, 2, 3, 4, 5, // EBML-id [47][E2], size=5 [85], keyId
      ];

  it('should parse/serialize the ContentEncKeyID element', () => {
    const element1 = <ContentEncKeyID value={new Buffer([1, 2, 3, 4, 5]).getView()} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
