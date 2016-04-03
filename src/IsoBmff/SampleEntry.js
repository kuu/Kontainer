import Box from './Box';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class SampleEntry extends Box {
  constructor(type, props, dataReferenceIndex) {
    super(type, props);
    this.dataReferenceIndex = dataReferenceIndex;
  }

  serialize(buffer, offset=0) {
    //console.log('--- SampleEntry.serialize enter.');
    const dataReferenceIndex = this.dataReferenceIndex;
    
    let base = offset;

    base += super.serialize(buffer, base);

    base += Writer.writeNumber(0, buffer, base, 6); // reserved (8)[6]

    base += Writer.writeNumber(dataReferenceIndex, buffer, base, 2);

    super.setSize(base - offset, buffer, offset);

    //console.log('--- SampleEntry.serialize exit.');
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props,
        dataReferenceIndex;

    [readBytesNum, props] = Box.parse(buffer, base);
    base += readBytesNum;

    base += 6; // skip reserved

    [readBytesNum, dataReferenceIndex] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    props.dataReferenceIndex = dataReferenceIndex;

    return [base - offset, props];
  }
}
