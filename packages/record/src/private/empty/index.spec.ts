import empty from "#empty";
import test from "@rcompat/test";
import NEVER from "@rcompat/test/NEVER";

test.case("no params", assert => {
  assert(() => empty(NEVER.undefined)).throws();
});
test.case("empty object", assert => {
  assert(empty({})).true();
});
test.case("non empty object", assert => {
  assert(empty({ foo: "bar" })).false();
  assert(empty({ foo: "bar", bar: { baz: "baz2" } })).false();
});
