import type IsUnion from "#IsUnion";
import test from "@rcompat/test";

test.case("true", assert => {
  assert<IsUnion<0 | 1>>().type<true>();
  assert<IsUnion<"bar" | "foo">>().type<true>();
  assert<IsUnion<number | string>>().type<true>();
  assert<IsUnion<boolean | number | string>>().type<true>();
  assert<IsUnion<boolean>>().type<true>();
  assert<IsUnion<false | true>>().type<true>();
  assert<IsUnion<boolean | Boolean>>().type<true>();
});

test.case("false", assert => {
  assert<IsUnion<unknown>>().type<false>();
  assert<IsUnion<never>>().type<false>();
  assert<IsUnion<string>>().type<false>();
  assert<IsUnion<"foo">>().type<false>();
  assert<IsUnion<number>>().type<false>();
  assert<IsUnion<0>>().type<false>();
  assert<IsUnion<true>>().type<false>();
  assert<IsUnion<false>>().type<false>();
  assert<IsUnion<Boolean>>().type<false>();
  assert<IsUnion<true | true>>().type<false>();
  assert<IsUnion<false | false>>().type<false>();
});
