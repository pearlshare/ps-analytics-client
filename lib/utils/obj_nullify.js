/**
 * remove null and undefined values from an object
 * @param {Object}  obj   object to nullify
 * @returns {Object} response object with only present values
 */
module.exports = function nullify (obj) {
  const out = {};
  for (var k in obj) {
    if (typeof obj[k] !== "undefined") {
      out[k] = obj[k];
    }
  }
  return out;
};
