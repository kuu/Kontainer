'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Box = require('./Box');

var MovieExtendsBox = function (_Box) {
  _inherits(MovieExtendsBox, _Box);

  function MovieExtendsBox(props) {
    _classCallCheck(this, MovieExtendsBox);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MovieExtendsBox).call(this, MovieExtendsBox.COMPACT_NAME, props));
  }

  return MovieExtendsBox;
}(Box);

MovieExtendsBox.COMPACT_NAME = 'mvex';

MovieExtendsBox.spec = {
  container: 'moov',
  quantity: Box.QUANTITY_EXACTLY_ONE, // Actually zero or one.
  mandatoryBoxList: ['trex']
};

module.exports = MovieExtendsBox;