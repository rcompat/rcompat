import Is from "./Is.js";
import { nullish } from "./attributes.js";

const operations = [
  // typeof
  "string", "number", "bigint", "boolean", "symbol", "function",
  // eq
  "undefined", "null",
  // other types
  "array", "object",
  // misc
  "defined", "constructible", "instance", "of", "subclass", "sub", "anyOf",
  // sizes
  "integer", "isize", "usize",

];

const return_nullish = value => nullish(value) ? value : true;

export default value => {
  const is = new Is(value);

  return Object.fromEntries(operations.map(operation =>
    [operation, (...args) => return_nullish(value) && is[operation](...args)]));
};
