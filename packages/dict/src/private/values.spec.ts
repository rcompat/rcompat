import values from "#values";
import test from "@rcompat/test";

test.case("typedoc", assert => {
  assert(values({ foo: "bar" })).equals(["bar"]);
  assert(values({ foo: "bar", baz: "qux" })).equals(["bar", "qux"]);
  assert(values({})).equals([]);
});

test.case("single value", assert => {
  assert(values({ key: "value" })).equals(["value"]);
});

test.case("mixed value types", assert => {
  const obj = { name: "Alice", age: 30, active: true };
  assert(values(obj)).equals(["Alice", 30, true]);
});

test.case("nested object values are not flattened", assert => {
  const obj = { foo: { bar: "baz" }, qux: "quux" };
  assert(values(obj)).equals([{ bar: "baz" }, "quux"]);
});

test.case("types", assert => {
  assert(values({ foo: "bar" })).type<string[]>();
  assert(values({ foo: 1 })).type<number[]>();
  assert(values({})).type<never[]>();
  assert(values({ a: 1, b: "two" })).type<(number | string)[]>();
  assert(values({ name: "Alice", age: 30, active: true }))
    .type<(string | number | boolean)[]>();
});
