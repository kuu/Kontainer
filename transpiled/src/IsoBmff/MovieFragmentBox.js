'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box');

var MovieFragmentBox = function (_Box) {
  _inherits(MovieFragmentBox, _Box);

  function MovieFragmentBox(props) {
    _classCallCheck(this, MovieFragmentBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MovieFragmentBox).call(this, MovieFragmentBox.COMPACT_NAME, props));
  }

  return MovieFragmentBox;
}(Box);

MovieFragmentBox.COMPACT_NAME = 'moof';

MovieFragmentBox.spec = {
  container: 'file',
  quantity: Box.QUANTITY_ANY_NUMBER,
  mandatoryBoxList: ['mfhd']
};

module.exports = MovieFragmentBox;