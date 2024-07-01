import type { DebrisTestSuite } from "@rcompat/core";
import stringify from "./stringify.js";

export default (test => {
  test.case("default", assert => {
    assert(stringify({})).equals("{}");
    assert(stringify({ foo: "bar" })).equals("{\n  \"foo\": \"bar\"\n}");
    assert(stringify({ foo: "bar", bar: "baz" }))
      .equals("{\n  \"foo\": \"bar\",\n  \"bar\": \"baz\"\n}");
  });
}) satisfies DebrisTestSuite;
