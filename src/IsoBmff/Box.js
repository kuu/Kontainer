function Box(type, props) {
  this.type = type;
  this.props = props;
}

Box.createBox = function (type, props, children) {
  var childrenLength = arguments.length - 2, childrenArray;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2]; 
    }   
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new Box(type, props);
}

Box.serialize = function (buffer, offset, instance) {
  var base = offset + 4,
      type = instance.type,
      extendedType, i;

  for (i = 0; i < 4; i++) {
    buffer[base + i] = type.charCodeAt(i);
  }
  if (instance.extendedType) {
    extendedType = instance.extendedType;
    base += 4;
    for (i = 0; i < 16; i++) {
      buffer[base + i] = extendedType.charCodeAt(i);
    }
    
};

Box.register = function (type, clazz) {
  boxImpl[type] = clazz;
};

module.exports = Box;
