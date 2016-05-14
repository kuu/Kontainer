import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('EditListBox', () => {
  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('mp4');
  });
  
  const value1 = [
        0, 0, 0, 40, // size=40
        101, 108, 115, 116, // type='elst'
        0, 0, 0, 0, // version=0, flags=0
        0, 0, 0, 2, // entry_count=2
        0, 0, 0, 10, //  segment_duration=10
        255, 255, 255, 255, // media_time=-1
        0, 1, 0, 0, //  media_rate_integer=1, media_rate_fraction=0
        0, 0, 0, 30, //  segment_duration=30
        0, 0, 0, 0, // media_time=0
        0, 1, 0, 0 //  media_rate_integer=1, media_rate_fraction=0
      ],
      value2 = [
        0, 0, 0, 56, // size=56
        101, 108, 115, 116, // type='elst'
        1, 0, 0, 0, // version=1, flags=0
        0, 0, 0, 2, // entry_count=2
        0, 0, 0, 0, //  segment_duration=10
        0, 0, 0, 10,
        255, 255, 255, 255, // media_time=-1
        255, 255, 255, 255,
        0, 1, 0, 0, //  media_rate_integer=1, media_rate_fraction=0
        0, 0, 0, 0, //  segment_duration=30
        0, 0, 0, 30,
        0, 0, 0, 0, // media_time=0
        0, 0, 0, 0,
        0, 1, 0, 0 //  media_rate_integer=1, media_rate_fraction=0
      ];

  it('should parse/serialize a list of timeline mappings', () => {
    const elstElement = <elst entries={[
      {
        segmentDuration: 10,
        mediaTime: -1,
        mediaRate: 1
      },
      {
        segmentDuration: 30,
        mediaTime: 0,
        mediaRate: 1
      }
    ]} />;
    const buffer = Kontainer.render(elstElement);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value1);
    const element1 = Kontainer.createElementFromBuffer(buffer);
    expect(element1).not.toBe(null);
    expect(element1).toHaveTheSameProps(elstElement);

    const element2 = Kontainer.createElementFromBuffer((new Buffer(value2)).getData());
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(elstElement);
  });
});
