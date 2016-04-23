import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';
import UnknownBox from '../../../../src/IsoBmff/Box/UnknownBox';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('UnknownBox', () => {
  const IsoBmff = Kontainer.IsoBmff,
      unknownValue = [
        0, 0, 0, 16, // size=16
        20, 20, 20, 20, // type='    ' (unknown)
        1, 2, 4, 8,
        16, 32, 64, 128
      ];

  it('can keep unknown box untouched', () => {

    const element = IsoBmff.createElementFromBuffer((new Buffer(unknownValue)).getData());
    expect(element).not.toBe(null);
    expect(element.type).toEqual(UnknownBox);
    const buffer = Kontainer.renderToBuffer(element);
    expect(buffer).toBeTheSameBuffer(unknownValue);
  });
});
