import type Primitive from "@rcompat/type/Primitive";

const primitives = [
  "string",
  "number",
  "boolean",
  "bigint",
  "symbol",
  "undefined",
];

export default function isPrimitive(x: unknown): x is Primitive {
  return primitives.includes(typeof x) || x === null;
}
