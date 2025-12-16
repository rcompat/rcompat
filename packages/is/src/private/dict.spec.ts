import isDict from "#dict";
import test from "@rcompat/test";

test.case("isDict - true", assert => {
  assert(isDict({})).true();
  assert(isDict({ a: 1 })).true();
  assert(isDict({ nested: { b: 2 } })).true();
  assert(isDict(Object.create(null))).true();
});

test.case("isDict - false", assert => {
  assert(isDict(null)).false();
  assert(isDict(undefined)).false();
  assert(isDict([])).false();
  assert(isDict([1, 2, 3])).false();
  assert(isDict(new Date())).false();
  assert(isDict(new Map())).false();
  assert(isDict(new Set())).false();
  assert(isDict(new RegExp(""))).false();
  assert(isDict(new URL("https://example.com"))).false();
  assert(isDict(new Error())).false();
  assert(isDict(() => { })).false();
  assert(isDict(42)).false();
  assert(isDict("string")).false();
  assert(isDict(true)).false();
  assert(isDict(Symbol())).false();
});

test.case("isDict - custom prototype", assert => {
  const proto = { x: 1 };
  const obj = Object.create(proto);
  obj.y = 2;
  assert(isDict(obj)).false();
});

test.case("isDict - class instances", assert => {
  class Foo { }
  class Bar extends Foo { }
  assert(isDict(new Foo())).false();
  assert(isDict(new Bar())).false();
});
