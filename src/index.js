var IsoBmff = require('./IsoBmff/'),
    PropTypes = require('./PropTypes'),
    Writer = require('./util/Writer'),
    Logger = require('./util/Logger');

function traversePostOrder(element, buffer, offset=0) {
  var instance, props, children, base = offset;

  if (!element) {
    return 0;
  }

  instance = element.instance;
  props = instance.props;
  children = props.children;

  base += instance.serialize(buffer, offset);

  children.forEach(child => {
    base += traversePostOrder(child, buffer, base);
  });

  instance.size = base - offset;
  instance.updateSize(buffer, offset);

  return instance.size;
}

function renderToArrayBuffer(element) {
  var size, buffer;

  // Culculate the entire byte size.
  size = traversePostOrder(element);

  buffer = new Uint8Array(size);
  traversePostOrder(element, buffer);

/*
  console.log('size=', buffer.length);
  for (var i = 0, il = buffer.length; i < il; i++) {
    console.log(buffer[i]);
  }
  */
  return buffer.buffer;
}

module.exports = {
  renderToArrayBuffer: renderToArrayBuffer,
  IsoBmff: IsoBmff,
  PropTypes: PropTypes,
  Writer: Writer,
  Logger: Logger
};
