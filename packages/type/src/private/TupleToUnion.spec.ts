import type TupleToUnion from "#TupleToUnion";
import type UnionToTuple from "#UnionToTuple";
import test from "@rcompat/test";

test.case("1-tuple", assert => {
  assert<TupleToUnion<[string]>>().type<string>();
});

test.case("2-tuple", assert => {
  // order doesn't matter
  assert<TupleToUnion<[string, boolean]>>().type<boolean | string>();
  assert<TupleToUnion<[boolean, string]>>().type<boolean | string>();

  // repetitions elided
  assert<TupleToUnion<[string, string]>>().type<string>();
  assert<TupleToUnion<[string, boolean, string]>>().type<boolean | string>();
});

test.case("n-tuple", assert => {
  assert<TupleToUnion<[string, boolean, number]>>()
    .type<boolean | number | string>();
});

test.case("marginals", assert => {
  assert<TupleToUnion<[string, any]>>().type<any>();
  assert<TupleToUnion<[string, unknown]>>().type<unknown>();
  // elided
  assert<TupleToUnion<[string, never]>>().type<string>();
  assert<TupleToUnion<[string, void]>>().type<string | void>();
});

test.case("there and back again", assert => {
  assert<TupleToUnion<UnionToTuple<boolean | string>>>()
    .type<boolean | string>();
});
