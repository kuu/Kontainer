import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('Unknown', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const UNKNOWN_ELEMENT_ID = [0x1B, 0x53, 0x86, 0x67];
  const unknownValue = [
        27, 83, 134, 103, 129, 1, // EBML-id [1B][53][86][67], size=1 [81], value=1
      ];

  it('can keep unknown element untouched', () => {

    const element = Kontainer.createElementFromBuffer((new Buffer(unknownValue)).getData());
    expect(element).not.toBe(null);
    expect(element.type.ELEMENT_ID).toBeTheSameBuffer(UNKNOWN_ELEMENT_ID);
    const buffer = Kontainer.render(element);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(unknownValue);
  });
});
