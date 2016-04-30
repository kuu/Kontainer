import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';

describe('ContentEncAlgo', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        71, 225, 129, 5, // EBML-id [47][E1], size=1 [81], algorithm=AES [5]
      ];

  it('should parse/serialize the ContentEncAlgo element', () => {
    const element1 = <ContentEncAlgo kind="AES" />;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
