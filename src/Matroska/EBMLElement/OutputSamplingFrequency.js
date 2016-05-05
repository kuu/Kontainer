import Component from '../../core/Component';
import TypeFloat from './TypeFloat';
import PropTypes from '../../core/PropTypes';

export default class OutputSamplingFrequency extends TypeFloat {
  constructor(props) {
    super(OutputSamplingFrequency.ELEMENT_ID, OutputSamplingFrequency.COMPACT_NAME, props);
  }
}

OutputSamplingFrequency.COMPACT_NAME = 'OutputSamplingFrequency';

OutputSamplingFrequency.ELEMENT_ID = [0x78, 0xB5];

OutputSamplingFrequency.propTypes = {
  value: PropTypes.number.isRequired
};

OutputSamplingFrequency.spec = {
  container: 'Audio',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
