import test from "@rcompat/test";
import int from "#int";
import any from "@rcompat/test/any";

test.case("true", assert => {
  assert(int(42)).true();
});

test.case("false", assert => {
  assert(int(42n)).false();
  assert(int(any("42"))).false();
  assert(int(any("3.14"))).false();
  assert(int(3.14)).false();
});
