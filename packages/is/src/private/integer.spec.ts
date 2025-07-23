import test from "@rcompat/test";
import isInteger from "#integer";
import any from "@rcompat/test/any";

test.case("true", assert => {
  assert(isInteger(42)).true();
  assert(isInteger(42n)).true();
});

test.case("false", assert => {
  assert(isInteger(any("42"))).false();
  assert(isInteger(any("3.14"))).false();
  assert(isInteger(3.14)).false();
});
