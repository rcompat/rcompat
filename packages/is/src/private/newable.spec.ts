import isNewable from "#newable";
import test from "@rcompat/test";

test.case("isNewable - true", assert => {
  class Foo { }
  class Bar extends Foo { }
  function Classic() { }
  const bound = Classic.bind(null);

  assert(isNewable(Foo)).true();
  assert(isNewable(Bar)).true();
  assert(isNewable(Classic)).true();
  assert(isNewable(bound)).true();
  assert(isNewable(Object)).true();
  assert(isNewable(Array)).true();
  assert(isNewable(Map)).true();
  assert(isNewable(Set)).true();
  assert(isNewable(Date)).true();
  assert(isNewable(Error)).true();
  assert(isNewable(RegExp)).true();
  assert(isNewable(Promise)).true();
});

test.case("isNewable - false", assert => {
  const arrow = () => { };
  async function asyncFn() { }
  function* generatorFn() { yield 1; }
  const obj = { method() { } };

  assert(isNewable(arrow)).false();
  assert(isNewable(asyncFn)).false();
  assert(isNewable(generatorFn)).false();
  assert(isNewable(obj.method)).false();
  assert(isNewable(Math.max)).false();
  assert(isNewable(parseInt)).false();
});

test.case("isNewable - non-functions", assert => {
  assert(isNewable(null)).false();
  assert(isNewable(undefined)).false();
  assert(isNewable(42)).false();
  assert(isNewable("string")).false();
  assert(isNewable(true)).false();
  assert(isNewable({})).false();
  assert(isNewable([])).false();
  assert(isNewable(Symbol())).false();
});
