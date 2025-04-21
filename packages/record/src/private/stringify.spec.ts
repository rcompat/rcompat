import stringify from "#stringify";
import test from "@rcompat/test";

test.case("default", assert => {
  assert(stringify({})).equals("{}");
  assert(stringify({ foo: "bar" })).equals(`{\n  "foo": "bar"\n}`);
  assert(stringify({ foo: "bar", bar: "baz" }))
    .equals(`{\n  "foo": "bar",\n  "bar": "baz"\n}`);
});
