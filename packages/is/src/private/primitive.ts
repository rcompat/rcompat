import type Primitive from "@rcompat/type/Primitive";

const primitives = [
  "bigint",
  "boolean",
  "number",
  "string",
  "symbol",
  "undefined",
];

export default function isPrimitive(x: unknown): x is Primitive {
  return primitives.includes(typeof x) || x === null;
}
