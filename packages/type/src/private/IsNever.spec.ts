import type IsNever from "#IsNever";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsNever<never>>().type<true>();
});

test.case("false", assert => {
  assert<IsNever<any>>().type<false>();
  assert<IsNever<unknown>>().type<false>();
  assert<IsNever<string>>().type<false>();
  assert<IsNever<"foo">>().type<false>();
  assert<IsNever<number>>().type<false>();
  assert<IsNever<0>>().type<false>();
  assert<IsNever<true>>().type<false>();
  assert<IsNever<false>>().type<false>();
});
