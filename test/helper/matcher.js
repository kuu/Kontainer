export default {
  toHaveTheSamePropsAs: (expected, actual) => {
    var isEqual = (a, b) => {
          //console.log('-----');
          //console.log(a);
          //console.log(b);
          if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
          } else if (typeof a === 'object' && typeof b === 'object') {
            return Object.keys(a).every(key => isEqual(a[key], b[key]));
          }
          return a === b;
        },
        checkEquality = (a, b) => {
          if (a instanceof Array && b instanceof Array) {
            return a.every((item, i) => checkEquality(item, b[i]));
          }
          return isEqual(a, b);
        },
        checkProps = (actualProps, expectedProps) => {
          return Object.keys(expectedProps).every(key => {
            var expectedChildren, actualChildren;

            if (key === 'children') {
              expectedChildren = expectedProps.children;
              actualChildren = actualProps.children;
              if (!actualChildren) {
                return false;
              }
              return expectedChildren.every((expectedChild, i) => {
                var actualChild = actualChildren[i];
                if (!actualChild) {
                  return false;
                }
                return checkProps(actualChild.props, expectedChild.props);
              });
            }
            return checkEquality(expectedProps[key], actualProps[key]);
          });
        };

    if (!expected || !actual) {
      return false;
    }
    return checkProps(actual.props, expected.props);
  }
};
