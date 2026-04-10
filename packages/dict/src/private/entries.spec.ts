import entries from "#entries";
import test from "@rcompat/test";

test.case("typedoc", assert => {
  assert(entries({ foo: "bar" })).equals([["foo", "bar"]]);
  assert(entries({ foo: "bar", baz: "qux" })).equals([["foo", "bar"],
  ["baz", "qux"]]);
  assert(entries({})).equals([]);
});

test.case("single entry", assert => {
  assert(entries({ key: "value" })).equals([["key", "value"]]);
});

test.case("mixed value types", assert => {
  const obj = { name: "Alice", age: 30, active: true };
  assert(entries(obj)).equals([["name", "Alice"], ["age", 30],
  ["active", true]]);
});

test.case("nested object values are not flattened", assert => {
  const obj = { foo: { bar: "baz" }, qux: "quux" };
  assert(entries(obj)).equals([["foo", { bar: "baz" }], ["qux", "quux"]]);
});

test.case("types", assert => {
  assert(entries({})).type<[never, never][]>();
  assert(entries({ foo: "bar" })).type<["foo", string][]>();
  assert(entries({ foo: 1 })).type<["foo", number][]>();
  assert(entries({ a: 1, b: "two" })).type<["a" | "b", number | string][]>();
  assert(entries({ name: "Alice", age: 30, active: true }))
    .type<["name" | "age" | "active", string | number | boolean][]>();
});
