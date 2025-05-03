import type IsUnknown from "#IsUnknown";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsUnknown<unknown>>().type<true>();
});

test.case("false", assert => {
  assert<IsUnknown<any>>().type<false>();
  assert<IsUnknown<never>>().type<false>();
  assert<IsUnknown<string>>().type<false>();

  assert<IsUnknown<"foo">>().type<false>();
  assert<IsUnknown<number>>().type<false>();
  assert<IsUnknown<0>>().type<false>();
  assert<IsUnknown<true>>().type<false>();
  assert<IsUnknown<false>>().type<false>();
});
