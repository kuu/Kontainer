var SampleEntry = require('./SampleEntry'),
    Writer = require('../core/Writer'),
    Reader = require('../core/Reader');

class VisualSampleEntry extends SampleEntry {
  constructor(type, props) {
    super(type, props, props.dataReferenceIndex);
  }

  serialize(buffer, offset=0) {
    //console.log('--- VisualSampleEntry.serialize enter.');
    var props = this.props,
        width = props.width,
        height = props.height,
        horizResolution = props.horizResolution,
        vertResolution = props.vertResolution,
        frameCount = props.frameCount,
        compressorName = props.compressorName,
        depth = props.depth,
        base = offset;

    base += super.serialize(buffer, base);

    base += Writer.writeNumber(0, buffer, base, 16); // reserved (32)[4]
    base += Writer.writeNumber(width, buffer, base, 2);
    base += Writer.writeNumber(height, buffer, base, 2);
    base += Writer.writeFixedNumber(horizResolution, buffer, base, 4);
    base += Writer.writeFixedNumber(vertResolution, buffer, base, 4);
    base += Writer.writeNumber(0, buffer, base, 4); // reserved (32)
    base += Writer.writeNumber(frameCount, buffer, base, 2);
    base += Writer.writeNumber(Math.min(compressorName.length, 31), buffer, base, 1);
    base += Writer.writeString(compressorName, buffer, base, 31);
    base += Writer.writeNumber(depth, buffer, base, 2);

    super.setSize(base - offset, buffer, offset);

    //console.log('--- VisualSampleEntry.serialize exit.');
    return this.size;
  }

  static parse(buffer, offset=0) {
    var base = offset,
        readBytesNum, props,
        width, height,
        horizResolution, vertResolution,
        frameCount, compressorName,
        compressorNameLength, depth;

    [readBytesNum, props] = SampleEntry.parse(buffer, base);
    base += readBytesNum;

    base += 16; // skip reserved

    [readBytesNum, width] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, height] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, horizResolution] = Reader.readFixedNumber(buffer, base, 4);
    base += readBytesNum;

    [readBytesNum, vertResolution] = Reader.readFixedNumber(buffer, base, 4);
    base += readBytesNum;

    base += 4; // skip reserved

    [readBytesNum, frameCount] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    [readBytesNum, compressorNameLength] = Reader.readNumber(buffer, base, 1);
    base += readBytesNum;

    [readBytesNum, compressorName] = Reader.readString(buffer, base, Math.min(compressorNameLength, 31));
    base += 31;

    [readBytesNum, depth] = Reader.readNumber(buffer, base, 2);
    base += readBytesNum;

    props.width = width;
    props.height = height;
    props.horizResolution = horizResolution;
    props.vertResolution = vertResolution;
    props.frameCount = frameCount;
    props.compressorName = compressorName;
    props.depth = depth;

    return [base - offset, props];
  }
}

module.exports = VisualSampleEntry;
