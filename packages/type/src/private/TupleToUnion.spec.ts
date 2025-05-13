import type TupleToUnion from "#TupleToUnion";
import type UnionToTuple from "#UnionToTuple";
import test from "@rcompat/test";

test.case("1-tuple", assert => {
  assert<TupleToUnion<[string]>>().type<string>();
});

test.case("2-tuple", assert => {
  // order doesn't matter
  assert<TupleToUnion<[string, boolean]>>().type<string | boolean>();
  assert<TupleToUnion<[boolean, string]>>().type<string | boolean>();

  // repetitions elided
  assert<TupleToUnion<[string, string]>>().type<string>();
  assert<TupleToUnion<[string, boolean, string]>>().type<string | boolean>();
});

test.case("n-tuple", assert => {
  assert<TupleToUnion<[string, boolean, number]>>()
    .type<string | boolean | number>();
});

test.case("marginals", assert => {
  assert<TupleToUnion<[string, any]>>().type<any>();
  assert<TupleToUnion<[string, unknown]>>().type<unknown>();
  // elided
  assert<TupleToUnion<[string, never]>>().type<string>();
  assert<TupleToUnion<[string, void]>>().type<string | void>();
});

test.case("there and back again", assert => {
  assert<TupleToUnion<UnionToTuple<string | boolean>>>()
    .type<string | boolean>();
});
