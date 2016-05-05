import Element from './Element';
import Buffer from '../../core/Buffer';
import Reader from '../../core/Reader';
import Writer from '../../core/Writer';
import {throwException} from '../../core/Util';

function decodeFlags(flags) {
  return {
    keyframe: !!(flags & 0x01),
    invisible: !!(flags & 0x10),
    lacing: (flags >>> 5) & 0x03,
    discardable: !!(flags & 0x80)
  };
}

function encodeFlags(flags) {
  let byte = 0;
  if (flags.keyframe) {
    byte |= 0x01;
  }
  if (flags.invisible) {
    byte |= 0x10;
  }
  byte |= (TypeBlock.LACING_EBML << 5);
  if (flags.discardable) {
    byte |= 0x80;
  }
  return byte;
}

function readEBMLFrameSize(buffer, offset) {
  const msb = buffer[offset];
  for (let i = 1; i <= 7; i++) {
    if ((msb >>> 8 - i) & 0x01) { // search the most left 1 bit
      buffer[offset] &= (0xFF >>> i); // drop left i bits
      if ((msb >>> 8 - i - 1) & 0x01) { // check sign
        // negative
        buffer[offset] |= (0xFF << 8 - i); // set the most left bits to 1s
      }
      const [readBytesNum, frameSize] = Reader.readNumber(buffer, offset, i, true);
      buffer[offset] = msb; // restore
      return [readBytesNum, frameSize];
    }
  }
  throwException('Invalid EBML frame size');
}

/*
function createNegativeMask(sizeLen) {
  let mask = 0xFF >>> (sizeLen + 1);
  for (let i = 1; i < sizeLen; i++) {
    mask = (mask << (i * 8)) | 0xFF;
  }
  return mask;
}
*/

function writeEBMLFrameSize(size, buffer, base, sizeLen) {
  /*
  if (size < 0) {
    size = ~(-size) & createNegativeMask(sizeLen);
  }
  */
  let msb = size >>> ((sizeLen - 1) * 8);
  msb &= (0xFF >>> sizeLen); // drop left sizeLen bits
  msb |= (0x01 << (8 - sizeLen)); // set the most left bit to 1
  let maskedSize = 0;
  for (let i = 0; i < sizeLen; i++) {
    if (i === 0) {
      maskedSize = msb;
    } else {
      maskedSize <<= 8;
      maskedSize |= ((size >>> ((sizeLen - i - 1) * 8)) & 0xFF);
    }
  }
  return Writer.writeNumber(maskedSize, buffer, base, sizeLen);
}

function getNecessaryBytesNumForEBMLFrameSize(value) {
  let bytesNum = 0;

  if (value >= -(1 << 6) && value <= (1 << 6) - 1) {
    bytesNum = 1;
  } else if (value >= -(1 << 13) && value <= (1 << 13) - 1) {
    bytesNum = 2;
  } else if (value >= -(1 << 20) && value <= (1 << 20) - 1) {
    bytesNum = 3;
  } else if (value >= -(1 << 27) && value <= (1 << 27) - 1) {
    bytesNum = 4;
  } else if (value >= -(1 << 34) && value <= (1 << 34) - 1) {
    bytesNum = 5;
  } else if (value >= -(1 << 41) && value <= (1 << 41) - 1) {
    bytesNum = 6;
  } else if (value >= -(1 << 48) && value <= (1 << 48) - 1) {
    bytesNum = 7;
  } else {
    throwException(`Matroska.TypeBlock.serialize(${value}): largesize(>=2^53) is not supported.`);
  }
  return bytesNum;
}

function readFrameSizeList(buffer, offset, length, lacing, numberOfFramesInLace) {
  let base = offset;

  if (lacing === TypeBlock.LACING_NONE) {
    return [0, []];
  } else if (lacing === TypeBlock.LACING_FIXED_SIZE) {
    return [0, new Array(numberOfFramesInLace).fill(Math.floor(length / numberOfFramesInLace))];
  }

  const frameSizeList = [];
  let tempSize = 0;

  for (let i = 0; i < numberOfFramesInLace; i++) {
    if (i !== 0 && i === numberOfFramesInLace - 1) {
      break;
    }
    if (lacing === TypeBlock.LACING_XIPH) {
      const byte = buffer[base++];
      tempSize += byte;
      if (byte !== 255) {
        frameSizeList.push(tempSize);
        tempSize = 0;
      }
    } else if (lacing === TypeBlock.LACING_EBML) {
      const [readBytesNum, frameSize] = readEBMLFrameSize(buffer, base);
      if (i === 0) {
        frameSizeList.push(frameSize);
      } else {
        frameSizeList.push(frameSizeList[i - 1] + frameSize);
      }
      base += readBytesNum;
    }
  }

  const theLastFrameSize = offset + length - base - frameSizeList.reduce((a, b) => a + b, 0);
  if (theLastFrameSize > 0) {
    frameSizeList.push(theLastFrameSize);
  }

  return [base - offset, frameSizeList];
}

export default class TypeBlock extends Element {
  constructor(...params) {
    super(...params);
  }

  serialize(buffer, offset=0) {
    const props = this.props;
    const trackNumber = props.trackNumber;
    const timecode = props.timecode;
    const flags = props.flags;
    const frames = props.frames;
    const trackNumberLength= Element.getNecessaryBytesNumForSize(trackNumber);

    let frameSizeList = [];
    let frameSizeLengthList = [];
    let frameLength = 0;

    for (let i = 0; i < frames.length; i++) {
      const len = frames[i].length;

      if (i === 0) {
        frameSizeList.push(len);
        frameSizeLengthList.push(getNecessaryBytesNumForEBMLFrameSize(len));
      } else if (i < frames.length - 1) {
        const diff = len - frames[i - 1].length;
        frameSizeList.push(diff);
        frameSizeLengthList.push(getNecessaryBytesNumForEBMLFrameSize(diff));
      }
      frameLength += len;
    }

    let totalSize = trackNumberLength
      + 2 // timecode
      + 1 // flags
      + 1 // numberOfFramesInLaceMinusOne
      + frameSizeLengthList.reduce((a, b) => a + b, 0)
      + frameLength;

    let base = offset;

    super.setElementSize(totalSize);

    base += super.serialize(buffer, base);
    base += Element.writeElementSize(trackNumber, buffer, base, trackNumberLength);
    base += Writer.writeNumber(timecode, buffer, base, 2);
    base += Writer.writeNumber(encodeFlags(flags), buffer, base, 1);
    base += Writer.writeNumber(frames.length - 1, buffer, base, 1);

    for (let i = 0; i < frames.length; i++) {
      if (i === 0 || i < frames.length - 1) {
        base += writeEBMLFrameSize(frameSizeList[i], buffer, base, frameSizeLengthList[i]);
      }
    }

    if (buffer) {
      let tempBase = base;
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        for (let j = 0; j < frame.length; j++) {
          buffer[tempBase++] = frame[j];
        }
      }
    }
    base += frameLength;

    return this.size;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props,
        trackNumber, timecode, flags,
        numberOfFramesInLaceMinusOne, frameSizeList;

    [readBytesNum, props] = Element.parse(buffer, base);
    base += readBytesNum;

    Reader.ASSERT(buffer, base, props.size);

    const endOfElement = base + props.size;

    [readBytesNum, trackNumber] = Element.readElementSize(buffer, base);
    base += readBytesNum;

    [readBytesNum, timecode] = Reader.readNumber(buffer, base, 2, true);
    base += readBytesNum;

    flags = buffer[base++];

    const {keyframe, invisible, lacing, discardable} = decodeFlags(flags);

    if (lacing === TypeBlock.LACING_NONE) {
      frameSizeList = [];
      const frameSize = endOfElement - base;
      if (frameSize > 0) {
        frameSizeList.push(frameSize);
      }
    } else {
      [readBytesNum, numberOfFramesInLaceMinusOne] = Reader.readNumber(buffer, base, 1);
      base += readBytesNum;

      [readBytesNum, frameSizeList] = readFrameSizeList(buffer, base, endOfElement - base, lacing, numberOfFramesInLaceMinusOne + 1);
      base += readBytesNum;
    }

    const frames = [];

    frameSizeList.forEach(frameSize => {
      const buf = new Buffer(frameSize);
      const data = buf.getView();

      for (let i = 0; i < frameSize; i++) {
        data[i] = buffer[base++];
      }
      frames.push(buf.getView());
    });

    props.trackNumber = trackNumber;
    props.timecode = timecode;
    props.flags = {keyframe, invisible, discardable};
    props.frames = frames;

    return [base - offset, props];
  }
}

TypeBlock.LACING_NONE = 0;
TypeBlock.LACING_XIPH = 1;
TypeBlock.LACING_EBML = 3;
TypeBlock.LACING_FIXED_SIZE = 2;
