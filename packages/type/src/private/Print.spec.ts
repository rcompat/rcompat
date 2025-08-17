import type Print from "#Print";
import type Printable from "#Printable";
import type PrintableGeneric from "#PrintableGeneric";
import test from "@rcompat/test";

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

  class Test implements Printable {
    get Name(): "Test" {
      return "Test";
    };
  }
  assert<Print<Test>>().type<"Test">();
});

test.case("generics", assert => {
  assert<Print<Set<unknown>>>().type<"Set<unknown>">();
  assert<Print<Set<void>>>().type<"Set<void>">();
  assert<Print<Set<never>>>().type<"Set<never>">();
  assert<Print<Set<any>>>().type<"Set<any>">();
  assert<Print<Set<string>>>().type<"Set<string>">();
  assert<Print<Set<String>>>().type<"Set<String>">();
  assert<Print<Set<[string, number]>>>().type<"Set<[string, number]>">();
  assert<Print<Set<Set<1>>>>().type<"Set<Set<1>>">();
  assert<Print<Set<Set<bigint>>>>().type<"Set<Set<bigint>>">();

  assert<Print<WeakSet<{ foo: string }>>>().type<"WeakSet<{ foo: string }>">();

  assert<Print<Map<string, unknown>>>().type<"Map<string, unknown>">();
  assert<Print<Map<unknown, unknown>>>().type<"Map<unknown, unknown>">();
  assert<Print<Map<Symbol, Set<[1n]>>>>().type<"Map<Symbol, Set<[1n]>>">();

  assert<Print<WeakMap<{ foo: 1n }, 2n>>>().type<"WeakMap<{ foo: 1n }, 2n>">();

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

  assert<Print<Int8Array>>().type<"Int8Array">();
  assert<Print<Uint8Array>>().type<"Uint8Array">();
  assert<Print<Uint8ClampedArray>>().type<"Uint8ClampedArray">();
  assert<Print<Int16Array>>().type<"Int16Array">();
  assert<Print<Uint16Array>>().type<"Uint16Array">();
  assert<Print<Int32Array>>().type<"Int32Array">();
  assert<Print<Uint32Array>>().type<"Uint32Array">();
  assert<Print<BigInt64Array>>().type<"BigInt64Array">();
  assert<Print<BigUint64Array>>().type<"BigUint64Array">();
  assert<Print<Float16Array>>().type<"Float16Array">();
  assert<Print<Float32Array>>().type<"Float32Array">();
  assert<Print<Float64Array>>().type<"Float64Array">();

  assert<Print<Awaited<"foo">>>().type<"'foo'">();
  assert<Print<Awaited<Promise<"foo">>>>().type<"'foo'">();
  assert<Print<Awaited<1>>>().type<"1">();
  assert<Print<Awaited<Promise<1>>>>().type<"1">();
  assert<Print<Awaited<Promise<bigint>>>>().type<"bigint">();

  class Class<T> implements PrintableGeneric<T> {
    get Name(): "Class" {
      return "Class";
    };
    get Type() {
      return undefined as T;
    }
  }
  assert<Print<Class<unknown>>>().type<"Class<unknown>">();
  assert<Print<Class<string>>>().type<"Class<string>">();

  class Class2<T> implements PrintableGeneric<T> {
    get Name(): "Class2" {
      return "Class2";
    };
    get Type() {
      return undefined as T;
    }
  }
  assert<Print<Class<Class2<Date>>>>().type<"Class<Class2<Date>>">();
  assert<Print<Class<Class2<[string, boolean]>>>>()
    .type<"Class<Class2<[string, boolean]>>">();

  class Generic<Name extends string, T> implements PrintableGeneric<T> {
    get Name(): Name {
      return undefined as unknown as Name;
    };
    get Type() {
      return undefined as T;
    }
  }
  class Class3<T> extends Generic<"Class3", T> {};
  assert<Print<Class3<unknown>>>().type<"Class3<unknown>">();
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
  assert<Print<number | string>>().type<"string | number">();
  assert<Print<boolean | number | string>>()
    .type<"string | number | boolean">();
  assert<Print<Date | string>>().type<"string | Date">();
  assert<Print<Blob | string>>().type<"string | Blob">();
  assert<Print<number | String>>().type<"number | String">();
  assert<Print<boolean | String>>().type<"boolean | String">();
  assert<Print<false | true>>().type<"boolean">();
  assert<Print<boolean | true>>().type<"boolean">();
  assert<Print<boolean | false>>().type<"boolean">();
  assert<Print<boolean | undefined>>().type<"boolean | undefined">();
  assert<Print<boolean | undefined>>().type<"boolean | undefined">();

  assert<Print<boolean | Boolean>>().fail<"boolean | Boolean">();
  assert<Print<Boolean | false | true>>().fail<"boolean | Boolean">();
  assert<Print<Boolean | true>>().fail<"true | Boolean">();
  assert<Print<Boolean | false>>().fail<"false | Boolean">();
  assert<Print<Boolean | string>>().type<"string | Boolean">();
  assert<Print<Boolean | String>>().type<"String | Boolean">();
  assert<Print<Blob | File>>().type<"Blob | File">();
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
  assert<Print<(number | string)[]>>().type<"(string | number)[]">();
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

  const _1: { count: number; foo: "bar" } = { count: 1, foo: "bar"};
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
