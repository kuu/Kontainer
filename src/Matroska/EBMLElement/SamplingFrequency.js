import Component from '../../core/Component';
import TypeFloat from './TypeFloat';
import PropTypes from '../../core/PropTypes';

export default class SamplingFrequency extends TypeFloat {
  constructor(props) {
    super(SamplingFrequency.ELEMENT_ID, SamplingFrequency.COMPACT_NAME, props);
  }
}

SamplingFrequency.COMPACT_NAME = 'SamplingFrequency';

SamplingFrequency.ELEMENT_ID = [0xB5];

SamplingFrequency.propTypes = {
  value: PropTypes.number
};

SamplingFrequency.defaultProps = {
  value: 8000.0
};

SamplingFrequency.spec = {
  container: 'Audio',
  quantity: Component.QUANTITY_EXACTLY_ONE,
  mandatoryList: []
};
