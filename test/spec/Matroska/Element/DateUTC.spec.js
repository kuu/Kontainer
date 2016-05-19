import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('DateUTC', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        68, 97, 136, 6, 145, 97, 165, 169, 252, 96, 0, // EBML-id [44][61], size=8 [88], date=2016/01/01(JST)
      ];

  it('should parse/serialize the DateUTC element', () => {
    const element1 = <DateUTC value={new Date('2016/01/01 00:00:00')} />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
