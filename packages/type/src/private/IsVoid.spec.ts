import type IsVoid from "#IsVoid";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsVoid<void>>().type<true>();
});

test.case("false", assert => {
  assert<IsVoid<never>>().type<false>();
  assert<IsVoid<any>>().type<false>();
  assert<IsVoid<unknown>>().type<false>();
  assert<IsVoid<string>>().type<false>();
  assert<IsVoid<"foo">>().type<false>();
  assert<IsVoid<number>>().type<false>();
  assert<IsVoid<0>>().type<false>();
  assert<IsVoid<true>>().type<false>();
  assert<IsVoid<false>>().type<false>();
  assert<IsVoid<void | number>>().type<false>();
});
