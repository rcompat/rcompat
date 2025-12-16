import proper, { type Proper } from "#proper";
import assert from "@rcompat/assert";

const proper_na = (o: unknown) => proper(o) && !Array.isArray(o);

const recurse = (t: unknown, u: unknown) =>
  (proper_na(t) && proper_na(u) ? override(t as Proper, u as Proper) : u) ?? t;

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
const override = <T extends Proper, U extends Proper>(base: T, over: U): T & U => {
  assert.true(proper(base));
  assert.true(proper(over));

  return (Object.keys(over) as (keyof (T & U))[])
    .reduce((overridden, key) => ({
      ...overridden,
      [key]: recurse(base[key as keyof T], over[key as keyof U]),
    }), base) as T & U;
};

export default override;
