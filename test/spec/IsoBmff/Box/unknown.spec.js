import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('UnknownBox', () => {
  const UNKNOWN_BOX_NAME = '    ';
  const unknownValue = [
        0, 0, 0, 16, // size=16
        32, 32, 32, 32, // type='    ' (unknown)
        1, 2, 4, 8,
        16, 32, 64, 128
      ];

  it('can keep unknown box untouched', () => {

    const element = Kontainer.createElementFromBuffer((new Buffer(unknownValue)).getData());
    expect(element).not.toBe(null);
    expect(element.type.COMPACT_NAME).toEqual(UNKNOWN_BOX_NAME);
    const buffer = Kontainer.render(element);
    expect(buffer).toBeTheSameBuffer(unknownValue);
  });
});
