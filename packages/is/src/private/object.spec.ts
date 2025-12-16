import isObject from "#object";
import test from "@rcompat/test";

test.case("isObject - true", assert => {
  assert(isObject({})).true();
  assert(isObject({ a: 1 })).true();
  assert(isObject([])).true();
  assert(isObject([1, 2, 3])).true();
  assert(isObject(new Date())).true();
  assert(isObject(new Map())).true();
  assert(isObject(new Set())).true();
  assert(isObject(new RegExp(""))).true();
  assert(isObject(new URL("https://example.com"))).true();
  assert(isObject(new Error())).true();
  assert(isObject(Object.create(null))).true();
});

test.case("isObject - false", assert => {
  assert(isObject(null)).false();
  assert(isObject(undefined)).false();
  assert(isObject(42)).false();
  assert(isObject(3.14)).false();
  assert(isObject(42n)).false();
  assert(isObject("string")).false();
  assert(isObject("")).false();
  assert(isObject(true)).false();
  assert(isObject(false)).false();
  assert(isObject(Symbol())).false();
  assert(isObject(() => { })).false();
  assert(isObject(function() { })).false();
});

test.case("isObject - class instances", assert => {
  class Foo { }
  class Bar extends Foo { }
  assert(isObject(new Foo())).true();
  assert(isObject(new Bar())).true();
});
