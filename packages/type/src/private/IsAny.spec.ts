import type IsAny from "#IsAny";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsAny<any>>().type<true>();
  assert<IsAny<{} & any>>().type<true>();
});

test.case("false", assert => {
  assert<IsAny<unknown>>().type<false>();
  assert<IsAny<never>>().type<false>();
  assert<IsAny<string>>().type<false>();
  assert<IsAny<"foo">>().type<false>();
  assert<IsAny<number>>().type<false>();
  assert<IsAny<0>>().type<false>();
  assert<IsAny<true>>().type<false>();
  assert<IsAny<false>>().type<false>();
});
