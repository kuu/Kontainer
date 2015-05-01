function arrayOf(type) {
  return {
    arrayOf: type
  };
}

module.exports = {
  string: 1,
  number: 2,
  arrayOf: arrayOf
};
