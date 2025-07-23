import test from "@rcompat/test";
import isEmpty from "#empty";

test.case("isEmpty", assert => {
  assert(isEmpty("")).true();
  assert(isEmpty("hello")).false();

  assert(isEmpty([])).true();
  assert(isEmpty([1])).false();

  assert(isEmpty({})).true();
  assert(isEmpty({ a: 1 })).false();

  assert(isEmpty(new Map())).true();
  assert(isEmpty(new Map([["key", "value"]]))).false();

  assert(isEmpty(new Set())).true();
  assert(isEmpty(new Set([1]))).false();

  assert(isEmpty(null)).false();
  assert(isEmpty(undefined)).false();
  assert(isEmpty(0)).false();
});
