import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('FileTypeBox', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });
  
  const defaultValue = [
        0, 0, 0, 16, // size=16
        102, 116, 121, 112, // type='ftyp'
        105, 115, 111, 109, // major_brand='isom'
        0, 0, 0, 0 // minor_version=0
      ],
      avc1Value = [
        0, 0, 0, 24, // size=24
        102, 116, 121, 112, // type='ftyp'
        97, 118, 99, 49, // major_brand='avc1'
        0, 0, 0, 2, // minor_version=2
        105, 115, 111, 109, // compatible_brands[0]='isom'
        105, 115, 111, 50 // compatible_brands[1]='iso2'
      ];

  it('requires major_brand', () => {
    const buffer = Kontainer.render(<ftyp />);
    expect(buffer).toBe(null);
  });

  it('can be initialized with the default values', () => {
    const buffer = Kontainer.render(<ftyp majorBrand="isom" />);
    expect(buffer).toBeTheSameBuffer(defaultValue);
  });

  it('can be initialized with the specified values', () => {
    const buffer = Kontainer.render(<ftyp {...{majorBrand: 'avc1', minorVersion: 2, compatibleBrands: ['isom', 'iso2']}} />);
    expect(buffer).toBeTheSameBuffer(avc1Value);
  });
});
