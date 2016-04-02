import SampleEntry from './SampleEntry';
import Writer from '../core/Writer';
import Reader from '../core/Reader';

export default class AudioSampleEntry extends SampleEntry {
  constructor(type, props) {
    super(type, props, props.dataReferenceIndex);
  }

  serialize(buffer, offset=0) {
    //console.log('--- AudioSampleEntry.serialize enter.');
    const props = this.props;
    const channelCount = props.channelCount;
    const sampleSize = props.sampleSize;
    const sampleRate = props.sampleRate;

    let base = offset;

    base += super.serialize(buffer, base);

    base += Writer.writeNumber(0, buffer, base, 8); // reserved (32)[2]
    base += Writer.writeNumber(channelCount, buffer, base, 2);
    base += Writer.writeNumber(sampleSize, buffer, base, 2);
    base += Writer.writeNumber(0, buffer, base, 4); // reserved (32)
    base += Writer.writeFixedNumber(sampleRate, buffer, base, 4);

    super.setSize(base - offset, buffer, offset);

    //console.log('--- AudioSampleEntry.serialize exit.');
    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset, readBytesNum, props,
        channelCount, sampleSize, sampleRate;

    [readBytesNum, props] = SampleEntry.parse(buffer, base);
    base += readBytesNum;

    base += 8; // skip reserved

    [readBytesNum, channelCount] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, sampleSize] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    base += 4; // skip reserved

    [readBytesNum, sampleRate] = Reader.readFixedNumber(buffer, base, 4);
    base += readBytesNum;

    props.channelCount = channelCount;
    props.sampleSize = sampleSize;
    props.sampleRate = sampleRate;

    return [base - offset, props];
  }
}
