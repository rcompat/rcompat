import type { DebrisTestSuite } from "@rcompat/core";
import empty from "@rcompat/array/empty";

export default (test => {
  test.case("no params", assert => {
    assert(() => empty(undefined as never)).throws();
  });
  test.case("empty array", assert => {
    assert(empty([])).true();
  });
  test.case("non empty object", assert => {
    assert(empty(["foo"])).equals(false);
    assert(empty([["foo"]])).equals(false);
  });
}) satisfies DebrisTestSuite;
