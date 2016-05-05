import Component from '../../core/Component';
import TypeUInt from './TypeUInt';
import PropTypes from '../../core/PropTypes';
import {throwException} from '../../core/Util';

function encodeValue(value) {
  switch (value) {
    case 'mono':
      return 0;
    case 'sideBySide-LeftFirst':
      return 1;
    case 'topBottom-RrightFirst':
      return 2;
    case 'topBottom-LeftFirst':
      return 3;
    /* Unsupported in WebM
    case 'checkboard-RightFirst':
      return 4;
    case 'checkboard-LeftFirst':
      return 5;
    case 'rowInterleaved-RightFirst':
      return 6;
    case 'rowInterleaved-LeftFirst':
      return 7;
    case 'columnInterleaved-RightFirst':
      return 8;
    case 'columnInterleaved-LeftFirst':
      return 9;
    case 'anaglyph-Cyan/Red':
      return 10;
    */
    case 'sideBySide-RightFirst':
      return 11;
    /* Unsupported in WebM
    case 'anaglyph-Green/Magenta':
      return 12;
    */
    case 'bothEyesLacedInOneBlock-LeftFirst':
      return 13;
    case 'bothEyesLacedInOneBlock-RightFirst':
      return 14;
  }
  throwException(`Unknow track type: (${value})`);
}

function decodeValue(value) {
  switch (value) {
    case 0:
      return 'mono';
    case 1:
      return 'sideBySide-LeftFirst';
    case 2:
      return 'topBottom-RrightFirst';
    case 3:
      return 'topBottom-LeftFirst';
    /* Unsupported in WebM
    case 4:
      return 'checkboard-RightFirst';
    case 5:
      return 'checkboard-LeftFirst';
    case 6:
      return 'rowInterleaved-RightFirst';
    case 7:
      return 'rowInterleaved-LeftFirst';
    case 8:
      return 'columnInterleaved-RightFirst';
    case 9:
      return 'columnInterleaved-LeftFirst';
    case 10:
      return 'anaglyph-Cyan/Red';
    */
    case 11:
      return 'sideBySide-RightFirst';
    /* Unsupported in WebM
    case 12:
      return 'anaglyph-Green/Magenta';
    */
    case 13:
      return 'bothEyesLacedInOneBlock-LeftFirst';
    case 14:
      return 'bothEyesLacedInOneBlock-RightFirst';
  }
  throwException(`Unknow track type: (${value})`);
}

export default class StereoMode extends TypeUInt {
  constructor(props) {
    super(StereoMode.ELEMENT_ID, StereoMode.COMPACT_NAME, props);
  }

  serialize(buffer, offset=0) {
    const value = this.props.kind;

    let base = offset;

    this.props.value = encodeValue(value);
    base += super.serialize(buffer, base);

    return base - offset;
  }

  static parse(buffer, offset=0) {
    let base = offset,
        readBytesNum, props;

    [readBytesNum, props] = TypeUInt.parse(buffer, base);
    base += readBytesNum;

    props.kind = decodeValue(props.value);

    return [base - offset, props];
  }
}

StereoMode.COMPACT_NAME = 'StereoMode';

StereoMode.ELEMENT_ID = [0x53, 0xB8];

StereoMode.propTypes = {
  kind: PropTypes.oneOf([
    'mono',
    'sideBySide-LeftFirst',
    'topBottom-RrightFirst',
    'topBottom-LeftFirst',
    /* Unsupported in WebM
    'checkboard-RightFirst',
    'checkboard-LeftFirst',
    'rowInterleaved-RightFirst',
    'rowInterleaved-LeftFirst',
    'columnInterleaved-RightFirst',
    'columnInterleaved-LeftFirst',
    'anaglyph-Cyan/Red',
    */
    'sideBySide-RightFirst',
    /* Unsupported in WebM
    'anaglyph-Green/Magenta',
    */
    'bothEyesLacedInOneBlock-LeftFirst',
    'bothEyesLacedInOneBlock-RightFirst',
  ])
};

StereoMode.defaultProps = {
  kind: 'mono'
};

StereoMode.spec = {
  container: 'Video',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
