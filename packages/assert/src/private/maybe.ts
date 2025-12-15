import Is from "#Is";
import is from "@rcompat/is";
import type Nullish from "@rcompat/type/Nullish";

const operations = [
  // typeof
  "string", "number", "bigint", "boolean", "symbol", "function",
  // eq
  "undefined", "null",
  // other types
  "array", "object", "dict", "uuid",
  // misc
  "defined", "newable", "instance", "subclass", "anyOf",
  // sizes
  "integer", "isize", "usize",
] as const;

const return_nullish = (value: unknown): Nullish | true =>
  is.nullish(value) ? value : true;

export default (value: unknown) => {
  const _is = new Is(value);

  return Object.fromEntries(operations.map(operation =>
    // Todo: Discuss the behavior for operations having more than 1 arguments
    [operation, (...args: any) =>
      return_nullish(value) && (_is[operation] as any)(...args)]));
};
