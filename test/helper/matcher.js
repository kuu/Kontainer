function isEqual(a, b) {
  //console.log('-----');
  //console.log(a);
  //console.log(b);
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  } else if (typeof a === 'object' && typeof b === 'object') {
    return Object.keys(a).every((key) => isEqual(a[key], b[key]));
  }
  return a === b;
}

function checkEquality(a, b) {
  if (a instanceof Array && b instanceof Array) {
    return a.every((item, i) => checkEquality(item, b[i]));
  }
  return isEqual(a, b);
}

const TO_BE_OMITTED = [
  'size',
  'type',
  'extendedType',
  'version',
  'flags',
  'initialSizeLen'
];

function checkProps(actualProps, expectedProps) {
  return Object.keys(expectedProps).every((key) => {

    if (TO_BE_OMITTED.indexOf(key) !== -1) {
      return true;
    }


    let expectedChildren, actualChildren;

    if (key === 'children') {
      expectedChildren = expectedProps.children;
      actualChildren = actualProps.children;
      if (!actualChildren) {
        return false;
      }
      return expectedChildren.every((expectedChild, i) => {
        const actualChild = actualChildren[i];
        if (!actualChild) {
          return false;
        }
        return checkProps(actualChild.props, expectedChild.props);
      });
    }
    return checkEquality(expectedProps[key], actualProps[key]);
  });
}

export default {
  toHaveTheSameProps(util, customEqualityTesters) {
    return {
      compare(actual, expected) {
        const result = {pass: false};
        if (!expected || !actual) {
          return result;
        }
        result.pass = checkProps(actual.props, expected.props);
        return result;
      }
    };
  },
  toBeTheSameBuffer(util, customEqualityTesters) {
    return {
      compare(actual, expected) {
        const result = {pass: false};
        let array;
        if (actual instanceof ArrayBuffer) {
          array = new Uint8Array(actual);
        } else {
          array = actual;
        }
        expect(array.length).toBe(expected.length);
        if (array.length !== expected.length) {
          return result;
        }
        for (let i = 0, il = array.length; i < il; i++) {
          //console.log('a[' + i + ']=' + array[i] + ', b[' + i + ']=' + expected[i]);
          if (array[i] !== expected[i]) {
            console.error(`The first different byte found at actual[${i}](${array[i]}) !== expected[${i}](${expected[i]})`);
            return result;
          }
        }
        result.pass = true;
        return result;
      }
    };
  }
};
