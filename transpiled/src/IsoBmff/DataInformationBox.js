'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box');

var DataInformationBox = function (_Box) {
  _inherits(DataInformationBox, _Box);

  function DataInformationBox(props) {
    _classCallCheck(this, DataInformationBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataInformationBox).call(this, DataInformationBox.COMPACT_NAME, props));
  }

  return DataInformationBox;
}(Box);

DataInformationBox.COMPACT_NAME = 'dinf';

DataInformationBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['dref']
};

module.exports = DataInformationBox;