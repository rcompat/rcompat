import Assert from "#Assert";
import Test from "#Test";
import FileRef from "@rcompat/fs/FileRef";
import test from "@rcompat/test";
import type EO from "@rcompat/type/EO";

const t = new Test("dummy", () => {}, new FileRef("/tmp"));

test.case("type", assert => {
  assert(new Assert<true>(t).type<true>()).true();
  assert(new Assert<"foo">(t).type<"foo">()).true();
  assert(new Assert<0>(t).type<0>()).true();
  assert(new Assert<0n>(t).type<0n>()).true();
  assert(new Assert<["foo"]>(t).type<["foo"]>()).true();
  assert(new Assert<["foo"][]>(t).type<["foo"][]>()).true();

  assert(new Assert<EO>(t).type<EO>()).true();
  assert(new Assert<[]>(t).type<[]>()).true();
});

test.case("type without values", assert => {

  assert(new Assert<"foo">(t).nottype<string>()).true();
  assert(new Assert<string>(t).nottype<"foo">()).true();
  assert(new Assert<"foo">(t).nottype<"bar">()).true();

  assert(new Assert<0>(t).nottype<1>()).true();
  assert(new Assert<1>(t).nottype<number>()).true();
  assert(new Assert<number>(t).nottype<1>()).true();

  assert(new Assert<0n>(t).nottype<1n>()).true();
  assert(new Assert<1n>(t).nottype<bigint>()).true();
  assert(new Assert<bigint>(t).nottype<1n>()).true();

  assert(new Assert<true>(t).nottype<false>()).true();
  assert(new Assert<true>(t).nottype<boolean>()).true();
  assert(new Assert<boolean>(t).nottype<true>()).true();

  assert(new Assert<["bar"][]>(t).nottype<["foo"]>()).true();
  assert(new Assert<["foo"]>(t).nottype<["bar"][]>()).true();

  assert(new Assert<string[]>(t).nottype<["foo"][]>()).true();
  assert(new Assert<[string]>(t).nottype<["foo"][]>()).true();

  assert(new Assert<["foo"][]>(t).nottype<string[]>()).true();
  assert(new Assert<["foo"][]>(t).nottype<[string]>()).true();

  assert(new Assert<string[]>(t).nottype<[string]>()).true();
  assert(new Assert<[string]>(t).nottype<string[]>()).true();

  assert(new Assert<[string, number]>(t).nottype<[number, string]>()).true();
  assert(new Assert<[number, string]>(t).nottype<[string, number]>()).true();

  assert(new Assert<EO>(t).nottype<[]>()).true();
  assert(new Assert<[]>(t).nottype<EO>()).true();
});
