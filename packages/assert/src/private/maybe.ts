import Is from "#Is";
import type Nullish from "@rcompat/type/Nullish";
import is_nullish from "#is-nullish";

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
] as const;

const return_nullish = (value: unknown): Nullish | true =>
  is_nullish(value) ? value : true;

export default (value: unknown) => {
  const is = new Is(value);

  return Object.fromEntries(operations.map(operation =>
    // Todo: Discuss the behavior for operations having more than 1 arguments
    [operation, (...args: any) =>
      return_nullish(value) && (is[operation] as any)(...args)]));
};
