import type { Dict } from "@rcompat/type";

export default function isDict(x: unknown): x is Dict {
  if (typeof x !== "object" || x === null) return false;

  const prototype = Object.getPrototypeOf(x);

  return prototype === Object.prototype || prototype === null;
}
