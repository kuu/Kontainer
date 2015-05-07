var IsoBmff = require('./IsoBmff/'),
    PropTypes = require('./core/PropTypes'),
    Writer = require('./core/Writer');

require("babel/polyfill");

function traverse(context, element, buffer, offset=0) {
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

  //console.log(`traverse enter. type=${type.COMPACT_NAME}`);

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
        console.error('Kontainer.renderToArrayBuffer: Prop validation failed: ' + err.message);
        return 0;
      }
    }
    // Validate context
    err = type.validate(context, props);
    if (err) {
      console.error('Kontainer.renderToArrayBuffer: Context validation failed: ' + err.message);
    }
    // Instantiation
    instance = element.instance = new type(props);
  }

  // Write self to the array buffer.
  base += instance.serialize(buffer, offset);

  // Write children to the array buffer.
  children.forEach(child => {
    base += traverse(context, child, buffer, base);
  });

  // Update the size.
  instance.setSize(base - offset, buffer, offset);

  //console.log(`traverse exit. type=${type.COMPACT_NAME} size=${instance.getSize()}`);
  return instance.getSize();
}

function renderToArrayBuffer(element) {
  var size, buffer, context = {};

  // Culculate the entire byte size.
  size = traverse(context, element);

  if (!size) {
    return null;
  }

  // Write to the array buffer.
  buffer = new Uint8Array(size);
  traverse(context, element, buffer);

  return buffer.buffer;
}

module.exports = {
  renderToArrayBuffer: renderToArrayBuffer,
  IsoBmff: IsoBmff,
  PropTypes: PropTypes,
  Writer: Writer
};
