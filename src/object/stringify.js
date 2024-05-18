export default (value, {
  replacer = undefined,
  space = 2,
} = {}) => JSON.stringify(value, replacer, space);
