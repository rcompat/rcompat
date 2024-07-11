import { assert } from "@rcompat/invariant";
import type { Proper } from "@rcompat/object/types";
import { default as proper } from "./proper.js";

const recurse = (t: unknown, u: unknown) =>
  (proper(t) && proper(u) ? extend(t as Proper, u as Proper) : u) ?? t;

/**
 * Extend a base object using an extension object, recursively overriding any
 * property in `base` that exists in `extension`.
 *
 * assert(extend({}, { foo: "bar" })).equals({ foo: "bar" });
 * assert(extend({ foo: "bar" }, { foo: "baz" })).equals({ foo: "baz" });
 * assert(extend({ foo: { bar: "baz" } }, { foo: { bar: "baz2"} }))
 *   .equals({ foo: { bar: "baz2"} });
 *
 * @param base the base object to extend
 * #param extension the extending object
 * @returns the result of extending `base` with `extension`
 */
const extend = <T extends Proper, U extends Proper>(base: T, extension: U): T & U => {
  assert(proper(base));
  assert(proper(extension));

  return (Object.keys(extension) as (keyof (T & U))[])
    .reduce((extended, key) => ({
      ...extended,
      [key]: recurse(base[key as keyof T], extension[key as keyof U]),
    }), base) as T & U;
};

export default extend;
