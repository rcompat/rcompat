import filter from "#filter";
import non_dicts from "#non-dicts";
import { Code } from "@rcompat/assert";
import test from "@rcompat/test";
import any from "@rcompat/test/any";
import undef from "@rcompat/test/undef";
import type { EmptyDict } from "@rcompat/type";

test.case("typedoc", assert => {
  assert(filter({ foo: "bar", baz: "qux" }, k => k === "foo"))
    .equals({ foo: "bar" });
  assert(filter({ a: 1, b: 2, c: 3 }, (_, v) => v > 1)).equals({ b: 2, c: 3 });
  assert(filter({}, () => true)).equals({});
});

test.case("faulty params", assert => {
  non_dicts.forEach(non => {
    assert(() => filter(any(non), () => true)).throws(Code.invalid_dict);
  });
  assert(() => filter(undef, () => true)).throws(Code.invalid_dict);
  assert(() => filter({ foo: "bar" }, undef)).throws(Code.invalid_function);
});

test.case("filter by key", assert => {
  const obj = { name: "Alice", age: 30, active: true };
  assert(filter(obj, k => k !== "age")).equals({ name: "Alice", active: true });
});

test.case("filter by value", assert => {
  const obj = { a: 1, b: 2, c: 3, d: 4 };
  assert(filter(obj, (_, v) => v % 2 === 0)).equals({ b: 2, d: 4 });
});

test.case("none pass", assert => {
  assert(filter({ a: 1, b: 2 }, () => false)).equals({});
});

test.case("all pass", assert => {
  const obj = { a: 1, b: 2 };
  assert(filter(obj, () => true)).equals(obj);
});

test.case("types", assert => {
  assert(filter({ foo: "bar" }, () => true)).type<Partial<{ foo: string }>>();
  assert(filter({}, () => true)).type<Partial<EmptyDict>>();
});
