import Kontainer from 'kontainer-js';
import Buffer from '../../../../src/core/Buffer';
import UnknownBox from '../../../../src/IsoBmff/Box/UnknownBox';

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
    let array;
    if (buffer instanceof ArrayBuffer) {
      array = new Uint8Array(buffer);
    } else {
      array = buffer;
    }
    expect(array.length).toBe(unknownValue.length);
    for (let i = 0, il = array.length; i < il; i++) {
      expect(array[i]).toBe(unknownValue[i]);
    }
  });
});
