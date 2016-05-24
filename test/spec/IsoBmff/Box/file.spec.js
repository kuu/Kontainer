import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import sample from '../../../helper/IsoBmff';
import Buffer from '../../../../src/core/Buffer';

describe('File', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });

  const topLevelElement = sample.element,
      value = sample.buffer;

  it('generates a binary data from KontainerElements', () => {
    let buffer, elem, array;

    buffer = Kontainer.render(
      <file>
        <moov>
          <mvhd />
        </moov>
      </file>
    );
    expect(buffer).toBe(null);

    const len = Kontainer.render(topLevelElement, {dryRun: true});
    buffer = Kontainer.render(topLevelElement);
    expect(buffer).not.toBe(null);
    expect(new Buffer(buffer).getLength()).toBe(len);
    expect(buffer).toBeTheSameBuffer(value);
    elem = Kontainer.createElementFromBuffer(buffer);
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
    elem = Kontainer.createElementFromBuffer(b);
    expect(elem).not.toBe(null);
    buf = Kontainer.render(elem);
    expect(buf).not.toBe(null);
    expect(buf).toBeTheSameBuffer(value);
  });
});
