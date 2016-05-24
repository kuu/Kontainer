import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('MediaDataBox', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });

  const mdatValue = [
        0, 0, 0, 16, // size=16
        109, 100, 97, 116, // type='mdat'
        1, 2, 4, 8,
        16, 32, 64, 128
      ];

  it('can wrrap raw bytes', () => {
    const data = new Buffer(8);
    for (let i = 0; i < 8; i++) {
      data[i] = (1 << i);
    }
    const buffer = Kontainer.render(<mdat {...{data}} />);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(mdatValue);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(element.props.data).toBeTheSameBuffer(mdatValue.slice(8));
    expect(element.props.byteOffset).toBe(8);
  });
});
