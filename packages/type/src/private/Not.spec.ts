import type Not from "#Not";
import test from "@rcompat/test";

test.case("test", assert => {
  assert<Not<true>>().type<false>();
  assert<Not<false>>().type<true>();
});
