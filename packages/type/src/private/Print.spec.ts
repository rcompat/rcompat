import test from "@rcompat/test";
import type Print from "#Print";
import Printable from "#Printable";
import PrintableGeneric from "#PrintableGeneric";

test.case("primitives", assert => {
  assert<Print<string>>().type<"string">();
  assert<Print<boolean>>().type<"boolean">();
  assert<Print<number>>().type<"number">();
  assert<Print<bigint>>().type<"bigint">();
  assert<Print<symbol>>().type<"symbol">();
  assert<Print<null>>().type<"null">();
  assert<Print<undefined>>().type<"undefined">();
});

test.case("classes", assert => {
  assert<Print<Boolean>>().type<"Boolean">();
  assert<Print<String>>().type<"String">();
  assert<Print<Number>>().type<"Number">();
  assert<Print<BigInt>>().type<"BigInt">();
  assert<Print<Symbol>>().type<"Symbol">();
  assert<Print<RegExp>>().type<"RegExp">();
  assert<Print<Error>>().type<"Error">();
  assert<Print<Object>>().type<"Object">();
  assert<Print<Function>>().type<"Function">();
  assert<Print<FormData>>().type<"FormData">();
  assert<Print<Blob>>().type<"Blob">();
  assert<Print<Date>>().type<"Date">();
  assert<Print<File>>().type<"File">();
  assert<Print<URL>>().type<"URL">();
  assert<Print<ReadableStream>>().type<"ReadableStream">();
  assert<Print<WritableStream>>().type<"WritableStream">();

  class Local {};
  assert<Print<Local>>().type<"Object">();

  class Test extends Printable<"Test"> {}
  assert<Print<Test>>().type<"Test">();
});

test.case("generics", assert => {
  assert<Print<Promise<unknown>>>().type<"Promise<unknown>">();
  assert<Print<Promise<void>>>().type<"Promise<void>">();
  assert<Print<Promise<never>>>().type<"Promise<never>">();
  assert<Print<Promise<any>>>().type<"Promise<any>">();
  assert<Print<Promise<string>>>().type<"Promise<string>">();
  assert<Print<Promise<String>>>().type<"Promise<String>">();
  assert<Print<Promise<[string, number]>>>()
    .type<"Promise<[string, number]>">();
  assert<Print<Promise<Promise<1>>>>().type<"Promise<Promise<1>>">();
  assert<Print<Promise<Promise<bigint>>>>().type<"Promise<Promise<bigint>>">();
  const _p = Promise.resolve();
  assert<Print<typeof _p>>().type<"Promise<void>">();

  assert<Print<ReadonlyArray<unknown>>>().type<"ReadonlyArray<unknown>">();
  assert<Print<ReadonlyArray<void>>>().type<"ReadonlyArray<void>">();
  assert<Print<ReadonlyArray<Promise<[boolean]>>>>()
    .type<"ReadonlyArray<Promise<[boolean]>>">();

  assert<Print<Awaited<"foo">>>().type<"'foo'">();
  assert<Print<Awaited<Promise<"foo">>>>().type<"'foo'">();
  assert<Print<Awaited<1>>>().type<"1">();
  assert<Print<Awaited<Promise<1>>>>().type<"1">();
  assert<Print<Awaited<Promise<bigint>>>>().type<"bigint">();

  class Test<T> extends PrintableGeneric<"Test", T> {}
  assert<Print<Test<unknown>>>().type<"Test<unknown>">();
  assert<Print<Test<string>>>().type<"Test<string>">();

  class Test2<T> extends PrintableGeneric<"Test2", T> {}
  assert<Print<Test<Test2<unknown>>>>().type<"Test<Test2<unknown>>">();
  assert<Print<Test<Test2<[string, boolean]>>>>()
    .type<"Test<Test2<[string, boolean]>>">();
});

test.case("literals", assert => {
  assert<Print<"foo">>().type<"'foo'">();
  assert<Print<true>>().type<"true">();
  assert<Print<false>>().type<"false">();
  assert<Print<0>>().type<"0">();
  assert<Print<0n>>().type<"0n">();
  const _s = Symbol("foo");
  type S = typeof _s;
  assert<Print<S>>().type<"symbol">();
});

test.case("unions", assert => {
  assert<Print<0 | 1>>().type<"0 | 1">();
  assert<Print<0 | 1 | 2>>().type<"0 | 1 | 2">();
  assert<Print<string | number>>().type<"string | number">();
  assert<Print<string | number | boolean>>()
    .type<"string | number | boolean">();
  assert<Print<string | Date>>().type<"string | Date">();
  assert<Print<string | Blob>>().type<"string | Blob">();
  assert<Print<number | String>>().type<"number | String">();
  assert<Print<boolean | String>>().type<"boolean | String">();
  assert<Print<true | false>>().type<"boolean">();
  assert<Print<true | boolean>>().type<"boolean">();
  assert<Print<false | boolean>>().type<"boolean">();

  assert<Print<boolean | Boolean>>().fail<"boolean | Boolean">();
  assert<Print<true | false | Boolean>>().fail<"boolean | Boolean">();
  assert<Print<true | Boolean>>().fail<"true | Boolean">();
  assert<Print<false | Boolean>>().fail<"false | Boolean">();
  assert<Print<string | Boolean>>().type<"string | Boolean">();
  assert<Print<String | Boolean>>().type<"String | Boolean">();
  assert<Print<File | Blob>>().type<"Blob | File">();
});

test.case("tuples", assert => {
  assert<Print<["foo"]>>().type<"['foo']">();
  assert<Print<[]>>().type<"[]">();
  assert<Print<[string]>>().type<"[string]">();
  assert<Print<[String]>>().type<"[String]">();
  assert<Print<[number]>>().type<"[number]">();
  assert<Print<[Number]>>().type<"[Number]">();
  assert<Print<[bigint]>>().type<"[bigint]">();
  assert<Print<[BigInt]>>().type<"[BigInt]">();
  assert<Print<[symbol]>>().type<"[symbol]">();
  assert<Print<[Symbol]>>().type<"[Symbol]">();
  assert<Print<[null]>>().type<"[null]">();
  assert<Print<[undefined]>>().type<"[undefined]">();
  assert<Print<[boolean]>>().type<"[boolean]">();
  assert<Print<[Boolean]>>().type<"[Boolean]">();
  assert<Print<[string, number, bigint]>>().type<"[string, number, bigint]">();
  assert<Print<[string, Number, bigint]>>().type<"[string, Number, bigint]">();
  assert<Print<[String, Number, BigInt]>>().type<"[String, Number, BigInt]">();
});

test.case("arrays", assert => {
  assert<Print<"foo"[]>>().type<"'foo'[]">();
  assert<Print<0[]>>().type<"0[]">();
  assert<Print<true[]>>().type<"true[]">();
  assert<Print<string[]>>().type<"string[]">();
  assert<Print<boolean[]>>().type<"boolean[]">();
  assert<Print<number[]>>().type<"number[]">();
  assert<Print<bigint[]>>().type<"bigint[]">();
  assert<Print<symbol[]>>().type<"symbol[]">();
  assert<Print<unknown[]>>().type<"unknown[]">();
  assert<Print<never[]>>().fail<"never[]">();
  assert<Print<any[]>>().fail<"any[]">();
  assert<Print<void[]>>().type<"void[]">();
  assert<Print<null[]>>().type<"null[]">();
  assert<Print<undefined[]>>().type<"undefined[]">();
  assert<Print<(string | number)[]>>().type<"(string | number)[]">();
  assert<Print<Array<unknown>>>().type<"unknown[]">();

});

test.case("object", assert => {
  const _0 = {};
  assert<Print<typeof _0>>().type<"{}">();
  assert<Print<{ foo: "bar" }>>().type<"{ foo: 'bar' }">();
  assert<Print<{ foo: string }>>().type<"{ foo: string }">();
  assert<Print<{ foo: true }>>().type<"{ foo: true }">();
  assert<Print<{ foo: boolean }>>().type<"{ foo: boolean }">();
  assert<Print<{ foo: 0 }>>().type<"{ foo: 0 }">();
  assert<Print<{ foo: number }>>().type<"{ foo: number }">();
  assert<Print<{ foo: 0n }>>().type<"{ foo: 0n }">();

  const _1: { foo: "bar", count: number } = { foo: "bar", count: 1};
  assert<Print<typeof _1>>().type<"{ foo: 'bar', count: number }">();
  assert<Print<{ a: true; b: string[] }>>().type<"{ a: true, b: string[] }">();

  const _t = { foo: [ "bar", 1n ]};
  const _t2 = { foo: [ "bar", 1n ]} as const;

  assert<Print<typeof _t>>().type<"{ foo: (string | bigint)[] }">();
  assert<Print<typeof _t2>>().fail<"{ foo: ['bar', 1n] }">();
  assert<Print<{ foo: { bar: "baz" }}>>().type<"{ foo: { bar: 'baz' } }">();
  assert<Print<{ foo: { bar: string }}>>().type<"{ foo: { bar: string } }">();
  assert<Print<{ foo: ["bar", 1n]}>>().type<"{ foo: ['bar', 1n] }">();
  assert<Print<{ foo: [string, bigint]}>>().type<"{ foo: [string, bigint] }">();
  assert<Print<{ foo: string[]}>>().type<"{ foo: string[] }">();
  assert<Print<{ foo: [string[]]}>>().type<"{ foo: [string[]] }">();

  const _s_foo = Symbol("foo");
  assert<Print<{ [_s_foo]: [string[]]}>>().type<"{}">();

  assert<Print<{ foo: [string, { bar: [symbol] }]}>>()
    .type<"{ foo: [string, { bar: [symbol] }] }">();

});
