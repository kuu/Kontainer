var IsoBmff = require('./IsoBmff/'),
    PropTypes = require('./util/PropTypes'),
    Writer = require('./util/Writer'),
    Logger = require('./util/Logger');

function traversePostOrder(element, func) {
  var props, children;

  if (!element) {
    return;
  }

  props = element.instance.props;
  children = props.children;

  children.forEach(child => {
    traversePostOrder(child, func);
  });

  func(element);
}

function renderToArrayBuffer(element) {
  var buffer, base = 0;

  // Check the whole byte length.
  traversePostOrder(element, elem => {
    element.instance.size += elem.instance.serialize();
  });

  buffer = new Uint8Array(element.instance.size);
  traversePostOrder(element, elem => {
    base += elem.instance.serialize(buffer, base);
  });

  var instance = element.instance;
  console.log('instance.size=', instance.size);
  for (var i = 0, il = buffer.length; i < il; i++) {
    console.log(buffer[i]);
  }
  return buffer.buffer;
}

module.exports = {
  renderToArrayBuffer: renderToArrayBuffer,
  IsoBmff: IsoBmff,
  PropTypes: PropTypes,
  Writer: Writer,
  Logger: Logger
};
