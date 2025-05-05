import test from "@rcompat/test";
import type EO from "@rcompat/type/EO";

test.case("type", assert => {
  assert<true>().type<true>();
  assert<true>().type(true);
  assert(true).type<true>();
  assert(true).type(true);

  assert<"foo">().type<"foo">();
  assert<"foo">().type("foo");
  assert("foo").type<"foo">();
  assert("foo").type("foo");

  assert<0>().type<0>();
  assert<0>().type(0);
  assert(0).type<0>();
  assert(0).type(0);

  assert<0n>().type<0n>();
  assert<0n>().type(0n);
  assert(0n).type<0n>();
  assert(0n).type(0n);

  type BU = boolean | undefined;
  assert<BU>().type<BU>();
  assert<BU>().nottype(true as BU);
  assert(true as BU).nottype<BU>();
  //assert(true as BU).type<true as BU>();

  assert<["foo"]>().type<["foo"]>();
  //assert<["foo"]>().type(["foo"]);
  assert(["foo"]).fail<["foo"]>();
  assert(["foo"]).type(["foo"]);

  assert<["foo"][]>().type<["foo"][]>();
  //assert<["foo"][]>().type(["foo", "foo"]);
  assert(["foo", "foo"]).fail<["foo"][]>();
  assert(["foo", "foo"]).type(["foo", "foo"]);

  assert<EO>().type<EO>();
  assert<EO>().type({});
  assert({}).type<EO>();
  assert({}).type({});

  assert<[]>().type<[]>();
  //assert<[]>().type([]);
  assert([]).fail<[]>();
  assert([]).type([]);
});

test.case("type without values", assert => {
  assert<"foo">().nottype<string>();
  assert<"foo">().nottype("foo" as string);
  assert("foo").nottype<string>();
  assert("foo").nottype("foo" as string);

  assert<string>().nottype<"foo">();
  assert<string>().nottype("foo");
  assert("foo" as string).nottype<"foo">();
  assert("foo" as string).nottype("foo");

  assert<"foo">().nottype<"bar">();
  assert<"foo">().nottype("bar");
  assert("foo").nottype<"bar">();
  assert("foo").nottype("bar");

  assert<0>().nottype<1>();
  assert<0>().nottype(1);
  assert(0).nottype<1>();
  assert(0).nottype(1);

  assert<1>().nottype<number>();
  assert<1>().nottype(1 as number);
  assert(1).nottype<number>();
  assert(1).nottype(1 as number);

  assert<number>().nottype<1>();
  assert<number>().nottype(1);
  assert(1 as number).nottype<1>();
  assert(1 as number).nottype(1);

  assert<0n>().nottype<1n>();
  assert<0n>().nottype(1n);
  assert(0n).nottype<1n>();
  assert(0n).nottype(1n);

  assert<1n>().nottype<bigint>();
  assert<1n>().nottype(1n as bigint);
  assert(1n).nottype<bigint>();
  assert(1n).nottype(1n as bigint);

  assert<bigint>().nottype<1n>();
  assert<bigint>().nottype(1n);
  assert(1n as bigint).nottype<1n>();
  assert(1n as bigint).nottype(1n);

  assert<true>().nottype<false>();
  assert<true>().nottype<boolean>();
  assert<boolean>().nottype<true>();

  assert<["bar"]>().nottype<["foo"]>();
  assert<["foo"][]>().nottype<["foo"]>();
  assert<["bar"][]>().nottype<["foo"]>();

  assert<["foo"][]>().nottype<["bar"]>();
  assert<["foo"]>().nottype<["foo"][]>();
  assert<["foo"]>().nottype<["bar"][]>();

  assert<string[]>().nottype<["foo"][]>();
  assert<[string]>().nottype<["foo"][]>();

  assert<["foo"][]>().nottype<string[]>();
  assert<["foo"][]>().nottype<[string]>();

  assert<[string][]>().nottype<[string]>();
  assert<[string]>().nottype<string[]>();

  assert<[string, number]>().nottype<[number, string]>();
  assert<[number, string]>().nottype<[string, number]>();

  assert<EO>().nottype<[]>();
  assert<[]>().nottype<EO>();
});
