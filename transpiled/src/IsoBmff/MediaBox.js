'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Box2 = require('./Box');

var _Box3 = _interopRequireDefault(_Box2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaBox = function (_Box) {
  _inherits(MediaBox, _Box);

  function MediaBox(props) {
    _classCallCheck(this, MediaBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MediaBox).call(this, MediaBox.COMPACT_NAME, props));
  }

  return MediaBox;
}(_Box3.default);

exports.default = MediaBox;


MediaBox.COMPACT_NAME = 'mdia';

MediaBox.spec = {
  container: 'trak',
  quantity: _Box3.default.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['mdhd', 'hdlr', 'minf']
};