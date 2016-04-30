import Kontainer from 'kontainer-js';
import customMatchers from '../../../helper/matcher';
import Buffer from '../../../../src/core/Buffer';

describe('Tags', () => {

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);
    Kontainer.use('webm');
  });

  const value = [
        18, 84, 195, 103, 16, 0, 1, 10, // EBML-id [12][54][C3][67], size=[01][0A]
        115, 115, 64, 129, // EBML-id [73][73], size=129 [40][81]
        99, 192, 144, // EBML-id [63][C0], size=16 [90]
        104, 202, 129, 48, // EBML-id [68][CA], size=1 [81], value=0x30
        99, 202, 133, 65, 76, 66, 85, 77, // EBML-id [63][CA], size=5 [85], country="ALBUM"
        99, 197, 129, 127, // EBML-id [63][C5], size=1 [81], id=127
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
        115, 115, 64, 129, // EBML-id [73][73], size=129 [40][81]
        99, 192, 144, // EBML-id [63][C0], size=16 [90]
        104, 202, 129, 48, // EBML-id [68][CA], size=1 [81], value=0x30
        99, 202, 133, 65, 76, 66, 85, 77, // EBML-id [63][CA], size=5 [85], country="ALBUM"
        99, 197, 129, 127, // EBML-id [63][C5], size=1 [81], id=127
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
        103, 200, 64, 51, // EBML-id [67][C8], size=51 [40][33]
        69, 163, 134, 80, 114, 105, 110, 99, 101, // EBML-id [45][A3], size=6 [86], tag="Prince"
        68, 122, 131, 106, 112, 110, // EBML-id [44][7A], size=3 [83], country="jpn"
        68, 132, 129, 0, // EBML-id [44][84], size=1 [81], isNotDefault
        68, 135, 149, 80, 114, 105, 110, 99, 101, 32, 97, 110, 100, 32, 82, 101, 118, 111, 108, 117, 116, 105, 111, 110, // EBML-id [44][87], size=21 [95], tag="Prince and Revolution"
        68, 133, 133, 1, 2, 3, 4, 5, // EBML-id [44][85], size=5 [85], version=1
      ];

  it('should parse/serialize the Tag element', () => {
    const element1 = <Tags>
      <Tag>
        <Targets>
          <TargetTypeValue value={0x30} />
          <TargetType value={"ALBUM"} />
          <TagTrackUID value={127} />
        </Targets>
        <SimpleTag>
          <TagName value={"Prince"} />
          <TagLanguage value={"jpn"} />
          <TagDefault value={false} />
          <TagString value={"Prince and Revolution"} />
          <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
        </SimpleTag>
        <SimpleTag>
          <TagName value={"Prince"} />
          <TagLanguage value={"jpn"} />
          <TagDefault value={false} />
          <TagString value={"Prince and Revolution"} />
          <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
        </SimpleTag>
      </Tag>
      <Tag>
        <Targets>
          <TargetTypeValue value={0x30} />
          <TargetType value={"ALBUM"} />
          <TagTrackUID value={127} />
        </Targets>
        <SimpleTag>
          <TagName value={"Prince"} />
          <TagLanguage value={"jpn"} />
          <TagDefault value={false} />
          <TagString value={"Prince and Revolution"} />
          <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
        </SimpleTag>
        <SimpleTag>
          <TagName value={"Prince"} />
          <TagLanguage value={"jpn"} />
          <TagDefault value={false} />
          <TagString value={"Prince and Revolution"} />
          <TagBinary value={new Buffer([1, 2, 3, 4, 5]).getView()} />
        </SimpleTag>
      </Tag>
    </Tags>;
    const buffer = Kontainer.render(element1);
    expect(buffer).not.toBe(null);
    expect(buffer).toBeTheSameBuffer(value);
    const element2 = Kontainer.createElementFromBuffer(buffer);
    expect(element2).not.toBe(null);
    expect(element2).toHaveTheSameProps(element1);
  });
});
