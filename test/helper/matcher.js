export default {
  toHaveTheSamePropsAs: function (util, customEqualityTesters) {
    return {
      compare: function (actual, expected) {
        if (expected === undefined) {
          expected = {};
        }
        var result = {},
            checkProps = function (actualProps, expectedProps) {
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
            return util.equals(expectedProps[key], actualProps[key], customEqualityTesters);
          });
        };
        result.pass = checkProps(actual.props, expected.props);
        if (result.pass) {
          result.message = "Expected KontainerElement has the same props as the actual one's.";
        } else {
          result.message = "Expected KontainerElement has different props than the actual one's.";
        }
        return result;
      }
    };
  }
};
