import empty from "#empty";
import type { DebrisTestSuite } from "@rcompat/core";

export default (test => {
  test.case("no params", assert => {
    assert(() => empty(undefined as never)).throws();
  });
  test.case("empty object", assert => {
    assert(empty({})).true();
  });
  test.case("non empty object", assert => {
    assert(empty({ foo: "bar" })).equals(false);
    assert(empty({ foo: "bar", bar: { baz: "baz2" } })).equals(false);
  });
}) satisfies DebrisTestSuite;
