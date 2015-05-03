var IsoBmff = require('./IsoBmff/'),
    PropTypes = require('./core/PropTypes'),
    Writer = require('./core/Writer');

require("babel/polyfill");

function traverse(element, buffer, offset=0) {
  var type, props, children, instance,
      propTypes, base = offset, err;

  if (!element) {
    console.warn('Kontainer.renderToArrayBuffer: null element.');
    return 0;
  }

  type = element.type;
  props = element.props;
  children = props.children;
  instance = element.instance;

  if (!instance) {
    // Validate props
    propTypes = type.propTypes;
    if (propTypes) {
      if (!Object.keys(propTypes).every(key => {
        err = propTypes[key](props, key, type.COMPACT_NAME);
        if (err) {
          return false;
        }
        return true;
      })) {
        console.error('Kontainer.renderToArrayBuffer: Validation failed: ' + err.message);
        return null;
      }
    }
    // Instantiation
    instance = element.instance = new type(props);
  }

  // Write self to the array buffer.
  base += instance.serialize(buffer, offset);

  // Write children to the array buffer.
  children.forEach(child => {
    base += traverse(child, buffer, base);
  });

  // Update the size.
  instance.setSize(base - offset, buffer, offset);

  return instance.getSize();
}

function renderToArrayBuffer(element) {
  var size, buffer;

  // Culculate the entire byte size.
  size = traverse(element);

  // Write to the array buffer.
  buffer = new Uint8Array(size);
  traverse(element, buffer);

  return buffer.buffer;
}

module.exports = {
  renderToArrayBuffer: renderToArrayBuffer,
  IsoBmff: IsoBmff,
  PropTypes: PropTypes,
  Writer: Writer
};
