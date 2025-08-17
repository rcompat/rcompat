import test from "@rcompat/test";
import isInteger from "#integer";
import any from "@rcompat/test/any";

test.case("true", assert => {
  assert(isInteger(42)).true();
});

test.case("false", assert => {
  assert(isInteger(42n)).false();
  assert(isInteger(any("42"))).false();
  assert(isInteger(any("3.14"))).false();
  assert(isInteger(3.14)).false();
});
