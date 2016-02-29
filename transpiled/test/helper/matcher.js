'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = {
  toHaveTheSamePropsAs: function toHaveTheSamePropsAs(expected, actual) {
    var isEqual = function isEqual(a, b) {
      //console.log('-----');
      //console.log(a);
      //console.log(b);
      if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
        return Object.keys(a).every(function (key) {
          return isEqual(a[key], b[key]);
        });
      }
      return a === b;
    },
        checkEquality = function checkEquality(a, b) {
      if (a instanceof Array && b instanceof Array) {
        return a.every(function (item, i) {
          return checkEquality(item, b[i]);
        });
      }
      return isEqual(a, b);
    },
        checkProps = function checkProps(actualProps, expectedProps) {
      return Object.keys(expectedProps).every(function (key) {
        var expectedChildren, actualChildren;

        if (key === 'children') {
          expectedChildren = expectedProps.children;
          actualChildren = actualProps.children;
          if (!actualChildren) {
            return false;
          }
          return expectedChildren.every(function (expectedChild, i) {
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