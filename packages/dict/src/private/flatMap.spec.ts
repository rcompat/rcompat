import flatMap from "#flatMap";
import non_dicts from "#non-dicts";
import { Code } from "@rcompat/assert";
import test from "@rcompat/test";
import any from "@rcompat/test/any";
import undef from "@rcompat/test/undef";
import type { Dict } from "@rcompat/type";

test.case("typedoc", assert => {
  assert(flatMap({ a: 1, b: 2 }, (k, v) => [k, v * 2])).equals({ a: 2, b: 4 });
  assert(flatMap({ a: 1, b: 2 }, (_, v) => v > 1 ? ["keep", v] : [])).equals({ keep: 2 });
  assert(flatMap({}, () => [])).equals({});
});

test.case("faulty params", assert => {
  non_dicts.forEach(non => {
    assert(() => flatMap(any(non), () => [])).throws(Code.invalid_dict);
  });
  assert(() => flatMap(undef, () => [])).throws(Code.invalid_dict);
  assert(() => flatMap({ foo: "bar" }, undef)).throws(Code.invalid_function);
});

test.case("filter via empty return", assert => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  assert(flatMap(obj, (k, v) => v % 2 === 0 ? [k, v] : [])).equals({ b: 2, d: 4 });
});

test.case("remap keys and values", assert => {
  assert(flatMap({ foo: 1, bar: 2 }, (k, v) => [k.toUpperCase(), v * 10]))
    .equals({ FOO: 10, BAR: 20 });
});

test.case("drop all entries", assert => {
  assert(flatMap({ a: 1, b: 2 }, () => [])).equals({});
});

test.case("keep all entries", assert => {
  const obj = { a: 1, b: 2 };
  assert(flatMap(obj, (k, v) => [k, v])).equals(obj);
});

test.case("types", assert => {
  assert(flatMap({ a: 1 }, (k, v) => [k, v])).type<Dict>();
  assert(flatMap({}, () => [])).type<Dict>();
});
