var SampleEntry = require('./SampleEntry'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class AudioSampleEntry extends SampleEntry {
  constructor(type, props) {
    super(type, props, props.dataReferenceIndex);
  }

  serialize(buffer, offset=0) {
    //console.log('--- AudioSampleEntry.serialize enter.');
    var props = this.props,
        channelCount = props.channelCount,
        sampleSize = props.sampleSize,
        sampleRate = props.sampleRate,
        base = offset;

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
    var base = offset, readBytesNum, props,
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

module.exports = AudioSampleEntry;