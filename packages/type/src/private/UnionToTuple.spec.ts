import type TupleToUnion from "#TupleToUnion";
import type UnionToTuple from "#UnionToTuple";
import test from "@rcompat/test";

test.case("single member", assert => {
  assert<UnionToTuple<string>>().type<[string]>();
});

test.case("2 members", assert => {
  // faulty boolean expansion in Print type
  //assert<UnionToTuple<string | boolean>>().type<[string, boolean]>();
  assert<UnionToTuple<number | string>>().type<[string, number]>();
  assert<UnionToTuple<number | string>>().type<[string, number]>();

  // repetitions elided
  assert<UnionToTuple<string | string>>().type<[string]>();
  assert<UnionToTuple<number | string | string>>().type<[string, number]>();
});

test.case("n members", assert => {
  assert<UnionToTuple<bigint | number | string>>()
    .type<[string, number, bigint]>();
  assert<UnionToTuple<bigint | number | string>>()
    .type<[string, number, bigint]>();
});

test.case("marginals", assert => {
  // should fail
  assert<UnionToTuple<any | string>>().type<any>();
  assert<UnionToTuple<any | string>>().type<[any]>();
  assert<UnionToTuple<string | unknown>>().type<[unknown]>();

  // elided
  assert<UnionToTuple<never | string>>().type<[string]>();
  assert<UnionToTuple<string | void>>().type<[string, void]>();
});

test.case("there and back again", assert => {
  assert<UnionToTuple<TupleToUnion<[string, number]>>>()
    .type<[string, number]>();
});
