import empty from "#empty";
import test from "@rcompat/test";
import undef from "@rcompat/test/undef";

test.case("no params", assert => {
  assert(() => empty(undef)).throws();
});
test.case("empty object", assert => {
  assert(empty({})).true();
});
test.case("non empty object", assert => {
  assert(empty({ foo: "bar" })).false();
  assert(empty({ bar: { baz: "baz2" }, foo: "bar" })).false();
});
