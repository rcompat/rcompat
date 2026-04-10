import impl from "#mapKey";
import non_dicts from "#non-dicts";
import { Code } from "@rcompat/assert";
import test from "@rcompat/test";
import any from "@rcompat/test/any";
import undef from "@rcompat/test/undef";
import type { Dict } from "@rcompat/type";

test.case("typedoc", assert => {
  assert(impl({ foo: "bar" }, k => k.toUpperCase())).equals({ FOO: "bar" });
  assert(impl({ a: 1, b: 2 }, (k, v) => `${k}${v}`)).equals({ a1: 1, b2: 2 });
  assert(impl({}, () => "x")).equals({});
});

test.case("faulty params", assert => {
  non_dicts.forEach(non => {
    assert(() => impl(any(non), () => "x")).throws(Code.invalid_dict);
  });
  assert(() => impl(undef, () => "x")).throws(Code.invalid_dict);
  assert(() => impl({ foo: "bar" }, undef)).throws(Code.invalid_function);
});

test.case("uppercase keys", assert => {
  const obj = { foo: 1, bar: 2, baz: 3 };
  assert(impl(obj, k => k.toUpperCase())).equals({ FOO: 1, BAR: 2, BAZ: 3 });
});

test.case("prefix keys", assert => {
  assert(impl({ a: 1, b: 2 }, k => `x_${k}`)).equals({ x_a: 1, x_b: 2 });
});

test.case("map using value", assert => {
  assert(impl({ foo: "f", bar: "b" }, (_, v) => v)).equals({ f: "f", b: "b" });
});

test.case("types", assert => {
  assert(impl({ foo: "bar" }, k => k.toUpperCase())).type<Dict<string>>();
  assert(impl({ a: 1, b: 2 }, k => k)).type<Dict<number>>();
  assert(impl({}, () => "x")).type<Dict<never>>();
});
