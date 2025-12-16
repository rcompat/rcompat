import type Dict from "@rcompat/type/Dict";

export default function isDict(x: unknown): x is Dict {
  return typeof x === "object" && x !== null;
}
