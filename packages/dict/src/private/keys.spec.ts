import keys from "#keys";
import test from "@rcompat/test";

test.case("typedoc", assert => {
  assert(keys({ foo: "bar" })).equals(["foo"]);
  assert(keys({ foo: "bar", baz: "qux" })).equals(["foo", "baz"]);
  assert(keys({})).equals([]);
});

test.case("returns array of keys", assert => {
  const obj = { name: "Alice", age: 30, active: true };
  assert(keys(obj)).equals(["name", "age", "active"]);
});

test.case("single key", assert => {
  assert(keys({ key: "value" })).equals(["key"]);
});

test.case("nested object keys are not flattened", assert => {
  const obj = { foo: { bar: "baz" }, qux: "quux" };
  assert(keys(obj)).equals(["foo", "qux"]);
});

test.case("types", assert => {
  const obj = { name: "Alice", age: 30 };

  assert(keys(obj)).type<("name" | "age")[]>();
  assert(keys({})).type<never[]>();
  assert(keys({ foo: "bar" })).type<"foo"[]>();
  assert(keys({ a: 1, b: 2, c: 3 })).type<("a" | "b" | "c")[]>();
});
