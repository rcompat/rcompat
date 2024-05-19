import Is from "./Is.js";
import Every from "./Every.js";
import { ErrorFallbackFunction } from "./errored.js";

const is = (value: unknown) => new Is(value);
const every = (...values: unknown[]) => new Every(...values);
const defined = (value: unknown, error?: ErrorFallbackFunction) => is(value).defined(error);

export { is, every, defined };
export { default as maybe } from "./maybe.js";
export { default as assert } from "./assert.js";
export { constructible, inconstructible_function } from "./construct.js";
export { numeric, boolish, nullish } from "./attributes.js";
export * from "./types.js";
