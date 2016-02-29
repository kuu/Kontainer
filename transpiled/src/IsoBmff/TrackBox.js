'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box');

var TrackBox = function (_Box) {
  _inherits(TrackBox, _Box);

  function TrackBox(props) {
    _classCallCheck(this, TrackBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(TrackBox).call(this, TrackBox.COMPACT_NAME, props));
  }

  return TrackBox;
}(Box);

TrackBox.COMPACT_NAME = 'trak';

TrackBox.spec = {
  container: 'moov',
  quantity: Box.QUANTITY_ANY_NUMBER, // Actually one or more.
  mandatoryBoxList: ['tkhd', 'mdia']
};

module.exports = TrackBox;