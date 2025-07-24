import toQueryString from "#toQueryString";
import test from "@rcompat/test";

test.case("default", assert => {
  assert(toQueryString({})).equals("");
  assert(toQueryString({ foo: "bar" })).equals("foo=bar");
});
