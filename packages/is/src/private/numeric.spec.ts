import test from "@rcompat/test";
import isNumeric from "#numeric";

test.case("isNumeric", assert => {
  assert(isNumeric("42")).true();
  assert(isNumeric("3.14")).true();
  assert(isNumeric("abc")).false();
  assert(isNumeric(123)).true();
  assert(isNumeric(NaN)).false();
  assert(isNumeric(Infinity)).false();
  assert(isNumeric(BigInt(100))).true();
});
