import Box from './Box';

export default class MovieExtendsBox extends Box {
  constructor(props) {
    super(MovieExtendsBox.COMPACT_NAME, props);
  }
}

MovieExtendsBox.COMPACT_NAME = 'mvex';

MovieExtendsBox.spec = {
  container: 'moov',
  quantity: Box.QUANTITY_EXACTLY_ONE, // Actually zero or one.
  mandatoryList: ['trex']
};
