'use strict';

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Box = require('./Box');

var SampleTableBox = (function (_Box) {
  function SampleTableBox(props) {
    _classCallCheck(this, SampleTableBox);

    _get(Object.getPrototypeOf(SampleTableBox.prototype), 'constructor', this).call(this, SampleTableBox.COMPACT_NAME, props);
  }

  _inherits(SampleTableBox, _Box);

  return SampleTableBox;
})(Box);

SampleTableBox.COMPACT_NAME = 'stbl';

SampleTableBox.spec = {
  container: 'minf',
  quantity: Box.QUANTITY_EXACTLY_ONE,
  mandatoryBoxList: ['stsd', 'stts', 'stsc', ['stsz', 'stz2'], ['stco', 'co64']]
};

module.exports = SampleTableBox;