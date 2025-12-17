import is from "#is";
import test from "@rcompat/test";
import type Dict from "@rcompat/type/Dict";
import type Newable from "@rcompat/type/Newable";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

type Is = Exclude<keyof typeof is, "instance">;

const fix = {
  bigint: [0n],
  boolean: [true, false],
  function: [() => undefined, function() {
    return undefined;
  }],
  null: [null],
  number: [0, Number(0)],
  string: ["", String()],
  undefined: [undefined],
} satisfies Partial<Record<Is, unknown[]>>;

const fixtures = Object.entries(fix) as [keyof typeof fix, unknown[]][];

test.case("non objects", assert => {
  fixtures.forEach(([key, values]) => {
    const non_values = fixtures.filter(entry => entry[0] !== key)
      .flatMap(([, value]) => value);
    values.forEach(value => {
      assert(is[key as Is](value)).equals(value);
      non_values.forEach(non_value =>
        assert(() => is[key as Is](non_value)).throws());
    });
  });
});

test.case("dict", assert => {
  const valid = [
    {},
    { a: 1, b: "x" },
    Object.create(null),
  ];

  class C { }
  const invalid: unknown[] = [
    null,
    [],
    new Date(),
    new C(),
    1,
    "string",
    true,
    undefined,
    () => { },
  ];

  valid.forEach(v => {
    assert(is.dict(v)).equals(v).type<Dict>();
  });
  invalid.forEach(v => assert(() => is.dict(v)).throws());
});

test.case("dict - edge cases", assert => {
  const nullproto = Object.create(null);
  const plain = { x: 1 };

  const customProto = { z: 1 };
  const withCustomProto = Object.create(customProto);
  withCustomProto.a = 1;

  class K { }
  const instance = new K();

  assert(is.dict(plain)).equals(plain).type<Dict>();
  assert(is.dict(nullproto)).equals(nullproto).type<Dict>();

  [withCustomProto, instance, new Map(), new Set(), [], new Date()].forEach(v =>
    assert(() => is.dict(v)).throws(),
  );
});

test.case("uuid", assert => {
  const valid = "3b12f1df-5232-4e3c-8bf2-32c1e3b7c1a3";

  const invalid: unknown[] = [
    "3B12F1DF-5232-4E3C-8BF2-32C1E3B7C1A3",   // uppercase
    "3b12f1df-5232-4e3c-0bf2-32c1e3b7c1a3",   // variant 0
    "3b12f1df-5232-1e3c-8bf2-32c1e3b7c1a3",   // version 1
    "3b12f1df-5232-5e3c-8bf2-32c1e3b7c1a3",   // version 5
    "3b12f1df-5232-4e3c-7bf2-32c1e3b7c1a3",   // variant 7
    "3b12f1df-5232-4e3c-cbf2-32c1e3b7c1a3",   // variant c/d/e/f not allowed
    "00000000-0000-0000-0000-000000000000",   // nil UUID
    "3b12f1df52324e3c8bf232c1e3b7c1a3",       // no hyphens
    "3b12f1df-5232-4e3c-8bf2-32c1e3b7c1a",    // too short
    "3b12f1df-5232-4e3c-8bf2-32c1e3b7c1a33",  // too long
    "3b12f1df-5232-4e3c-8bf2-32c1e3b7c1a3\n", // trailing newline
    "not-a-uuid",
    123,
    null,
    undefined,
  ];

  assert(is.uuid(valid)).equals(valid).type<string>();
  invalid.forEach(v => assert(() => is.uuid(v)).throws());
});

test.case("uuid matches crypto.randomUUID output", assert => {
  for (let i = 0; i < 5; i++) {
    const id = crypto.randomUUID();
    assert(is.uuid(id)).equals(id).type<string>();
    assert(id).equals(id.toLowerCase());
  }
});

test.case("object / array / defined / undefined / null", assert => {
  const object = { a: 1 };
  const array: unknown = [1, 2, 3];
  class C { }
  const instance = new C();

  assert(is.object(object)).equals(object).type<object>();
  assert(is.object(array)).equals(array).type<object>();
  assert(is.instance(instance, C)).equals(instance).type<C>();

  [null, 1, "x", true, undefined].forEach(v =>
    assert(() => is.object(v)).throws(),
  );

  assert(is.array(array)).equals(array).type<unknown[]>();
  [object, instance, null, 1, "x", true, undefined].forEach(v =>
    assert(() => is.array(v)).throws(),
  );

  assert(is.defined("")).equals("");
  assert(is.defined(0)).equals(0);
  assert(is.defined(false)).equals(false);
  assert(() => is.defined(undefined)).throws();

  assert(is.undefined(undefined)).equals(undefined).type<undefined>();
  [null, 0, false, "", {}].forEach(v =>
    assert(() => is.undefined(v)).throws(),
  );

  assert(is.null(null)).equals(null).type<null>();
  [undefined, 0, false, "", {}].forEach(v => assert(() => is.null(v)).throws());
});

test.case("newable", assert => {
  class C { }
  function F(this: any) { }
  const arrow = () => { };
  const plain = {};

  assert(is.newable(C)).equals(C).type<Newable>();
  assert(is.newable(F)).equals(F).type<Newable>();
  assert(is.newable(Date)).equals(Date).type<Newable>();

  [arrow, plain, 1, "x", null, undefined].forEach(v =>
    assert(() => is.newable(v)).throws(),
  );
});

test.case("instance", assert => {
  class Base { }
  class Sub extends Base { }
  class Other { }

  const sub = new Sub();
  const other = new Other();

  assert(is.instance(sub, Base)).equals(sub).type<Base>();
  assert(is.instance(sub, Sub)).equals(sub).type<Sub>();
  assert(() => is.instance(other, Base)).throws();
  assert(() => is.instance({}, Base)).throws();
});

test.case("number", assert => {
  assert(is.number(NaN)).equals(NaN).type<number>();
  assert(is.number(Infinity)).equals(Infinity).type<number>();
  assert(is.number(42)).equals(42).type<number>();
});

test.case("(u)int", assert => {
  const { int, uint } = is;

  assert(int(10)).equals(10).type<number | bigint>();
  assert(int(-10)).equals(-10).type<number | bigint>();
  assert(int(0)).equals(0).type<number | bigint>();
  assert(int(-0)).equals(-0).type<number | bigint>();
  assert(int(10n)).equals(10n).type<number | bigint>();
  [Number.NaN, Infinity, -Infinity, 1.1].forEach(v =>
    assert(() => int(v)).throws(),
  );

  assert(uint(10)).equals(10).type<number | bigint>();
  assert(uint(0)).equals(0).type<number | bigint>();
  assert(uint(-0)).equals(-0).type<number | bigint>();
  assert(uint(10n)).equals(10n).type<number | bigint>();
  assert(() => uint(1.5)).throws();
  assert(() => uint("1")).throws();
  [Number.NaN, Infinity, -Infinity, -1, 2.5, -1n].forEach(v =>
    assert(() => uint(v)).throws(),
  );
});

test.case("true / false (literal booleans)", assert => {
  assert(is.true(true)).equals(true).type<true>();
  assert(is.false(false)).equals(false).type<false>();

  [false, 1, "true", null, undefined].forEach(v =>
    assert(() => is.true(v)).throws(),
  );
  [true, 0, "", null, undefined].forEach(v =>
    assert(() => is.false(v)).throws(),
  );
});

test.case("boolean wrapper objects are not boolean primitives", assert => {
  const boxedTrue = new Boolean(true);
  const boxedFalse = new Boolean(false);

  [boxedTrue, boxedFalse].forEach(v =>
    assert(() => is.boolean(v)).throws(),
  );
});

test.case("function", assert => {
  const fn = () => undefined;
  assert(is.function(fn)).equals(fn).type<UnknownFunction>();
});

test.case("function varieties + newable cross-check", assert => {
  function F() { }
  const arrow = () => { };
  async function A() { }
  function* G() { yield 1; }
  const bound = F.bind(null);
  class C { }

  assert(is.function(F)).equals(F).type<UnknownFunction>();
  assert(is.function(arrow)).equals(arrow).type<UnknownFunction>();
  assert(is.function(A)).equals(A).type<UnknownFunction>();
  assert(is.function(G)).equals(G).type<UnknownFunction>();
  assert(is.function(bound)).equals(bound).type<UnknownFunction>();
  assert(is.function(C)).equals(C).type<UnknownFunction>();

  assert(is.newable(C)).equals(C).type<Newable>();
  assert(is.newable(F)).equals(F).type<Newable>();
  assert(is.newable(bound)).equals(bound).type<Newable>();
  [arrow, A, G, {}, 1, "x", null, undefined].forEach(v =>
    assert(() => is.newable(v)).throws(),
  );
});

test.case("symbol", assert => {
  const s = Symbol("x");
  const a = Symbol.for("foo");
  const b = Symbol.for("foo");

  assert(is.symbol(s)).equals(s).type<symbol>();
  assert(is.symbol(a)).equals(a).type<symbol>();
  assert(a).equals(b);

  [1, "s", null, undefined, {}, [], () => { }].forEach(v =>
    assert(() => is.symbol(v)).throws(),
  );
});

test.case("date", assert => {
  const d = new Date();
  assert(is.date(d)).equals(d).type<Date>();
  assert(() => is.date(Date.now())).throws();
  assert(() => is.date("today")).throws();
});

test.case("map", assert => {
  const m = new Map([["a", 1]]);
  assert(is.map(m)).equals(m).type<Map<unknown, unknown>>();
  assert(() => is.map({})).throws();
  assert(() => is.map(new Set())).throws();
});

test.case("set", assert => {
  const s = new Set([1, 2, 3]);
  assert(is.set(s)).equals(s).type<Set<unknown>>();
  assert(() => is.set({})).throws();
  assert(() => is.set(new Map())).throws();
});

test.case("regexp", assert => {
  const r = /test/;
  assert(is.regexp(r)).equals(r).type<RegExp>();
  assert(() => is.regexp("test")).throws();
  assert(() => is.regexp({})).throws();
});

test.case("url", assert => {
  const u = new URL("https://example.com");
  assert(is.url(u)).equals(u).type<URL>();
  assert(() => is.url("https://example.com")).throws();
  assert(() => is.url({})).throws();
});

test.case("promise", assert => {
  const p = Promise.resolve(42);
  assert(is.promise(p)).equals(p).type<Promise<unknown>>();
  assert(() => is.promise({})).throws();
  assert(() => is.promise(() => { })).throws();
});

test.case("error", assert => {
  const e = new Error("test");
  const te = new TypeError("test");
  assert(is.error(e)).equals(e).type<Error>();
  assert(is.error(te)).equals(te).type<Error>();
  assert(() => is.error("error")).throws();
  assert(() => is.error({})).throws();
});

test.case("finite", assert => {
  assert(is.finite(42)).equals(42).type<number | bigint>();
  assert(is.finite(-42)).equals(-42).type<number | bigint>();
  assert(is.finite(3.14)).equals(3.14).type<number | bigint>();
  assert(is.finite(42n)).equals(42n).type<number | bigint>();
  assert(() => is.finite(NaN)).throws();
  assert(() => is.finite(Infinity)).throws();
  assert(() => is.finite(-Infinity)).throws();
});

test.case("safeint", assert => {
  const MSI = Number.MAX_SAFE_INTEGER;

  assert(is.safeint(42)).equals(42).type<number>();
  assert(is.safeint(MSI)).equals(MSI).type<number>();
  assert(() => is.safeint(MSI + 1)).throws();
  assert(() => is.safeint(3.14)).throws();
  assert(() => is.safeint(42n)).throws();
});

test.case("nan", assert => {
  assert(is.nan(NaN)).type<number>();
  assert(is.nan(Number.NaN)).type<number>();
  assert(() => is.nan(42)).throws();
  assert(() => is.nan("NaN")).throws();
});

test.case("nullish", assert => {
  assert(is.nullish(null)).equals(null);
  assert(is.nullish(undefined)).equals(undefined);
  assert(() => is.nullish(0)).throws();
  assert(() => is.nullish("")).throws();
  assert(() => is.nullish(false)).throws();
});

test.case("nonempty", assert => {
  assert(is.nonempty("hello")).equals("hello");
  assert(is.nonempty([1, 2])).equals([1, 2]);
  assert(is.nonempty({ a: 1 }));
  assert(is.nonempty(new Map([["a", 1]])));
  assert(is.nonempty(new Set([1])));
  assert(() => is.nonempty("")).throws();
  assert(() => is.nonempty([])).throws();
  assert(() => is.nonempty({})).throws();
  assert(() => is.nonempty(new Map())).throws();
  assert(() => is.nonempty(new Set())).throws();
});
