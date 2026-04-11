import assert from "@rcompat/assert";
import is from "@rcompat/is";
import type { Dict } from "@rcompat/type";

function recurse(t: unknown, u: unknown) {
  return (is.dict(t) && is.dict(u) ? override(t as Dict, u as Dict) : u) ?? t;
}

/**
 * Override an object with another recursively.
 *
 * assert(override({}, { foo: "bar" })).equals({ foo: "bar" });
 * assert(override({ foo: "bar" }, { foo: "baz" })).equals({ foo: "baz" });
 * assert(override({ foo: { bar: "baz" } }, { foo: { bar: "baz2"} }))
 *   .equals({ foo: { bar: "baz2"} });
 *
 * @param base the base object to override
 * @param over the overriding object
 * @returns the result of overriding `base` with `over` recursively
 */
const override = <T extends Dict, U extends Dict>(base: T, over: U): T & U => {
  assert.dict(base);
  assert.dict(over);

  return (Object.keys(over) as (keyof (T & U))[])
    .reduce((overridden, key) => ({
      ...overridden,
      [key]: recurse(base[key as keyof T], over[key as keyof U]),
    }), base) as T & U;
};

export default override;
