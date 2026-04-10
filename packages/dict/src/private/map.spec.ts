import map from "#map";
import non_dicts from "#non-dicts";
import { Code } from "@rcompat/assert";
import test from "@rcompat/test";
import any from "@rcompat/test/any";
import undef from "@rcompat/test/undef";

test.case("typedoc", assert => {
  assert(map({ a: 1, b: 2 }, (_, v) => v * 2)).equals({ a: 2, b: 4 });
  assert(map({ foo: "bar" }, (_, v) => v.toUpperCase())).equals({ foo: "BAR" });
  assert(map({}, () => true)).equals({});
});

test.case("faulty params", assert => {
  non_dicts.forEach(non => {
    assert(() => map(any(non), () => true)).throws(Code.invalid_dict);
  });
  assert(() => map(undef, () => true)).throws(Code.invalid_dict);
  assert(() => map({ foo: "bar" }, undef)).throws(Code.invalid_function);
});

test.case("map values", assert => {
  const obj = { a: 1, b: 2, c: 3 };
  assert(map(obj, (_, v) => v * 10)).equals({ a: 10, b: 20, c: 30 });
});

test.case("map using key", assert => {
  assert(map({ foo: 1, bar: 2 }, (k, v) => `${k}:${v}`))
    .equals({ foo: "foo:1", bar: "bar:2" });
});

test.case("change value type", assert => {
  assert(map({ a: 1, b: 2 }, (_, v) => String(v))).equals({ a: "1", b: "2" });
});

test.case("types", assert => {
  assert(map({ a: 1, b: 2 }, (_, v) => v * 2)).type<{ a: number; b: number }>();
  assert(map({ a: 1, b: 2 }, (_, v) => String(v)))
    .type<{ a: string; b: string }>();
  assert(map({ foo: "bar" }, (_, v) => v.length)).type<{ foo: number }>();
  assert(map({}, () => true)).type<{ [K in never]: boolean }>();
});
