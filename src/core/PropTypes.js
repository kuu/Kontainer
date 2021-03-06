// PropTypes was implemented by reference to Facebook's React (https://github.com/facebook/react)
// React is BSD licensed and its copyright is below:

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *  * Neither the name Facebook nor the names of its contributors may be used to
 *    endorse or promote products derived from this software without specific
 *    prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const ANONYMOUS = '<<anonymous>>';

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  const propType = typeof propValue;

  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  const propType = getPropType(propValue);

  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName) {
    componentName = componentName || ANONYMOUS;
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(
          `Required \`${propName}\` was not specified in ` +
          `\`${componentName}\`.`
        );
      }
      return null;
    } else {
      return validate(props, propName, componentName);
    }
  }

  const chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName) {
    const propValue = props[propName];
    const propType = getPropType(propValue);

    if (propType !== expectedType) {
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      const preciseType = getPreciseType(propValue);

      return new Error(
        `Invalid \`${propName}\` of type \`${preciseType}\` ` +
        `supplied to \`${componentName}\`, expected \`${expectedType}\`.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(() => null);
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName) {
    const propValue = props[propName];

    if (!Array.isArray(propValue)) {
      const propType = getPropType(propValue);

      return new Error(
        `Invalid \`${propName}\` of type ` +
        `\`${propType}\` supplied to \`${componentName}\`, expected an array.`
      );
    }
    for (let i = 0; i < propValue.length; i++) {
      const error = typeChecker(propValue, i, componentName);

      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName) {
    if (!(props[propName] instanceof expectedClass)) {
      let expectedClassName = expectedClass.name || ANONYMOUS;

      return new Error(
        `Invalid \`${propName}\` supplied to ` +
        `\`${componentName}\`, expected instance of \`${expectedClassName}\`.`
      );
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  function validate(props, propName, componentName) {
    const propValue = props[propName];

    for (let i = 0; i < expectedValues.length; i++) {
      if (propValue === expectedValues[i]) {
        return null;
      }
    }

    const valuesString = JSON.stringify(expectedValues);
    return new Error(
      `Invalid \`${propName}\` of value \`${propValue}\` ` +
      `supplied to \`${componentName}\`, expected one of ${valuesString}.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName) {
    const propValue = props[propName];
    const propType = getPropType(propValue);

    if (propType !== 'object') {
      return new Error(
        `Invalid \`${propName}\` of type ` +
        `\`${propType}\` supplied to \`${componentName}\`, expected an object.`
      );
    }
    for (let key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        const error = typeChecker(propValue, key, componentName);

        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(TypeCheckers) {
  function validate(props, propName, componentName) {
    for (let i = 0; i < arrayOfTypeCheckers.length; i++) {
      const checker = arrayOfTypeCheckers[i];

      if (checker(props, propName, componentName) == null) {
        return null;
      }
    }

    return new Error(
      `Invalid \`${propName}\` supplied to ` +
      `\`${componentName}\`.`
    );
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName) {
    const propValue = props[propName];
    const propType = getPropType(propValue);

    if (propType !== 'object') {
      return new Error(
        `Invalid \`${propName}\` of type \`${propType}\` ` +
        `supplied to \`${componentName}\`, expected \`object\`.`
      );
    }
    for (let key in shapeTypes) {
      const checker = shapeTypes[key];

      if (!checker) {
        continue;
      }
      const error = checker(propValue, key, componentName);

      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

export default {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  instanceOf: createInstanceTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};
