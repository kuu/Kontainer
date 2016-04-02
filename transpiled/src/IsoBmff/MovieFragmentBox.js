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

var MovieFragmentBox = function (_Box) {
  _inherits(MovieFragmentBox, _Box);

  function MovieFragmentBox(props) {
    _classCallCheck(this, MovieFragmentBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MovieFragmentBox).call(this, MovieFragmentBox.COMPACT_NAME, props));
  }

  return MovieFragmentBox;
}(_Box3.default);

exports.default = MovieFragmentBox;


MovieFragmentBox.COMPACT_NAME = 'moof';

MovieFragmentBox.spec = {
  container: 'file',
  quantity: _Box3.default.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: ['mfhd']
};