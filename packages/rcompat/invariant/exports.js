import Is from "./Is.js";
import Every from "./Every.js";

const is = value => new Is(value);
const every = (...values) => new Every(...values);
const defined = (value, error) => is(value).defined(error);

export { is, every, defined };
export { default as maybe } from "./maybe.js";
export { default as assert } from "./assert.js";
export { constructible, inconstructible_function } from "./construct.js";
export { numeric, boolish, nullish } from "./attributes.js";
