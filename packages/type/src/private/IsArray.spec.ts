import type IsArray from "#IsArray";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsArray<string[]>>().type<true>();
  assert<IsArray<readonly string[]>>().type<true>();
});

test.case("false", assert => {
  assert<IsArray<[]>>().type<false>();
  assert<IsArray<[string]>>().type<false>();
  assert<IsArray<[string, number]>>().type<false>();
  assert<IsArray<readonly [0, 1, 2]>>().type<false>();
  // no distribution
  assert<IsArray<never>>().type<false>();
  assert<IsArray<any>>().type<false>();
  assert<IsArray<unknown>>().type<false>();
});

