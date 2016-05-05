import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

beforeEach(() => {
  jasmine.addMatchers(customMatchers);
  Kontainer.use('mp4');
});

describe('MovieExtendsHeaderBox', () => {
  const value1 = [
        0, 0, 0, 16, // size=16
        109, 101, 104, 100, // type='mehd'
        0, 0, 0, 0, // version=0, flags=0
        1, 0, 0, 0 // fragment_duration=16777216
      ],
      value2 = [
        0, 0, 0, 20, // size=20
        109, 101, 104, 100, // type='mehd'
        1, 0, 0, 0, // version=1, flags=0
        0, 0, 0, 1, // fragment_duration=4294967296
        0, 0, 0, 0
      ];

  it('supports 32 bit duration', () => {
    const mehdElement = <mehd fragmentDuration={16777216} />;
    const buffer = Kontainer.render(mehdElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(mehdElement).toHaveTheSameProps(element);
  });

  it('supports 64 bit duration', () => {
    const mehdElement = <mehd version={1} fragmentDuration={4294967296} />;
    const buffer = Kontainer.render(mehdElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value2);
    const element = Kontainer.createElementFromBuffer(buffer);
    expect(element).not.toBe(null);
    expect(mehdElement).toHaveTheSameProps(element);
  });
});
