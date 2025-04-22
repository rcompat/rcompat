import empty from "#empty";
import test from "@rcompat/test";
import undef from "@rcompat/test/undef";

test.case("no params", assert => {
  assert(() => empty(undef)).throws();
});
test.case("empty array", assert => {
  assert(empty([])).true();
});
test.case("non empty object", assert => {
  assert(empty(["foo"])).equals(false);
  assert(empty([["foo"]])).equals(false);
});
