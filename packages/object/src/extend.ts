import { assert } from "@rcompat/invariant";
import proper from "./proper.js";

const recurse = (t: unknown, u: unknown) =>
  (proper(t) && proper(u) ? extend(t as object, u as object) : u) ?? t;

// recursively extend base with extension, overriding non-object properties
// where both exist
const extend = <T extends object, U extends object>(base: T, extension: U): T & U => {
  assert(proper(base));
  assert(proper(extension));

  return (Object.keys(extension) as (keyof (T & U))[])
    .reduce((extended, key) => ({
      ...extended,
      [key]: recurse(base[key as keyof T], extension[key as keyof U]),
    }), base) as T & U;
};

export default extend;
