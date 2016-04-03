import Box from './Box';

export default class MovieFragmentBox extends Box {
  constructor(props) {
    super(MovieFragmentBox.COMPACT_NAME, props);
  }
}

MovieFragmentBox.COMPACT_NAME = 'moof';

MovieFragmentBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: ['mfhd']
};
