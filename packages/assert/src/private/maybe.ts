import Is from "#Is";
import nullish from "@rcompat/is/nullish";
import type Nullish from "@rcompat/type/Nullish";

const operations = [
  // typeof
  "string", "number", "bigint", "boolean", "symbol", "function",
  // eq
  "undefined", "null",
  // other types
  "array", "object", "record", "uuid",
  // misc
  "defined", "newable", "instance", "subclass", "anyOf",
  // sizes
  "integer", "isize", "usize",
] as const;

const return_nullish = (value: unknown): Nullish | true =>
  nullish(value) ? value : true;

export default (value: unknown) => {
  const is = new Is(value);

  return Object.fromEntries(operations.map(operation =>
    // Todo: Discuss the behavior for operations having more than 1 arguments
    [operation, (...args: any) =>
      return_nullish(value) && (is[operation] as any)(...args)]));
};
