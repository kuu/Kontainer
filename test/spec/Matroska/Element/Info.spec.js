import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('Info', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        21, 73, 169, 102, 64, 71, // EBML-id [15][49][A9][66] size=71 [40][49]
        42, 215, 177, 131, 30, 132, 128, // EBML-id [2A][D7][B1], size=3 [83], timestamp scale=2000000(ns) [1E][84][80]
        68, 137, 136, 0, 1, 0, 0, 0, 0, 0, 0, // EBML-id [44][89], size=8 [88], duration=65536.0 [00][01][00][00][00][00][00][00]
        68, 97, 136, 6, 145, 97, 165, 169, 252, 96, 0, // EBML-id [44][61], size=8 [88], date=2016/01/01(JST)
        123, 169, 137, 227, 131, 134, 227, 130, 185, 227, 131, 136, // EBML-id [7B][A9], size=9 [89], title="TEST(in Japanese)" [E3, 83, 86, E3, 82, B9, E3, 83, 88]
        77, 128, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [4D][80], size=12 [8C], title="kontainer-js"
        87, 65, 140, 107, 111, 110, 116, 97, 105, 110, 101, 114, 45, 106, 115, // EBML-id [57][41], size=12 [8C], title="kontainer-js"
      ];

  it('should parse/serialize the Info element', () => {
    const element1 = <Info>
      <TimecodeScale value={2000000} />
      <Duration value={65536} />
      <DateUTC value={new Date('2016/01/01 00:00:00')} />
      <Title value={'\u30C6\u30B9\u30C8'} />
      <MuxingApp value="kontainer-js" />
      <WritingApp value="kontainer-js" />
    </Info>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    /*
    console.log('++++++++++');
    for (let i = 0; i < buffer.length; i++) {
      console.log(`\tbuffer[${i}]=${buffer[i]}`);
    }
    */
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
