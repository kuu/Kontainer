import Box from './Box';

export default class EditBox extends Box {
  constructor(props) {
    super(EditBox.COMPACT_NAME, props);
  }
}

EditBox.COMPACT_NAME = 'edts';

EditBox.spec = {
  container: 'trak',
  quantity: Box.QUANTITY_ZERO_OR_ONE,
  mandatoryList: []
};
