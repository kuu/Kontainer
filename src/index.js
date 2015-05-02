var IsoBmff = require('./IsoBmff/'),
    PropTypes = require('./PropTypes'),
    Writer = require('./util/Writer'),
    Logger = require('./util/Logger');

require("babel/polyfill");

function traverse(element, buffer, offset=0) {
  var instance, props, children, base = offset;

  if (!element) {
    return 0;
  }

  instance = element.instance;
  props = instance.props;
  children = props.children;

  base += instance.serialize(buffer, offset);

  children.forEach(child => {
    base += traverse(child, buffer, base);
  });

  instance.size = base - offset;
  instance.updateSize(buffer, offset);

  return instance.size;
}

function renderToArrayBuffer(element) {
  var size, buffer;

  // Culculate the entire byte size.
  size = traverse(element);

  // Write to the array buffer.
  buffer = new Uint8Array(size);
  traverse(element, buffer);

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
