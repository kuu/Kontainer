import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import sample from '../../../helper/IsoBmff';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('File', () => {
  const IsoBmff = Kontainer.IsoBmff,
      topLevelElement = sample.element,
      value = sample.buffer;

  it('generates a binary data from KontainerElements', () => {
    let buffer, elem, array;

    buffer = Kontainer.renderToBuffer(
      <file>
        <moov>
          <mvhd />
        </moov>
      </file>
    );
    expect(buffer).toBe(null);

    buffer = Kontainer.renderToBuffer(topLevelElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    elem = IsoBmff.createElementFromBuffer(buffer);
    expect(elem).toHaveTheSameProps(topLevelElement);
  });

  it('parses a binary data into KontainerElements', () => {
    let b, elem, buf, array;

    if (global.Buffer) {
      b = new global.Buffer(value);
    } else {
      buf = new Uint8Array(value);
      b = buf.buffer;
    }
    elem = IsoBmff.createElementFromBuffer(b);
    expect(elem).not.toBe(null);
    buf = Kontainer.renderToBuffer(elem);
    expect(buf).not.toBe(null);
    expect(buf).toBeTheSameBuffer(value);
  });
});
