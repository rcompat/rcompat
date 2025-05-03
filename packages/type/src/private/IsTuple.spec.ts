import type IsTuple from "#IsTuple";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsTuple<[]>>().type<true>();
  assert<IsTuple<[string]>>().type<true>();
  assert<IsTuple<[string, number]>>().type<true>();
  assert<IsTuple<readonly [0, 1, 2]>>().type<true>();
});

test.case("false", assert => {
  assert<IsTuple<string[]>>().type<false>();
  assert<IsTuple<readonly string[]>>().type<false>();
  // no distribution
  assert<IsTuple<never>>().type<false>();
  assert<IsTuple<any>>().type<false>();
  assert<IsTuple<unknown>>().type<false>();
});
