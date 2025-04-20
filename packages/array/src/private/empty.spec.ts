import empty from "#empty";
import test from "@rcompat/test";
import NEVER from "@rcompat/test/NEVER";

test.case("no params", assert => {
  assert(() => empty(NEVER(undefined))).throws();
});
test.case("empty array", assert => {
  assert(empty([])).true();
});
test.case("non empty object", assert => {
  assert(empty(["foo"])).equals(false);
  assert(empty([["foo"]])).equals(false);
});
