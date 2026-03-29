import { Code } from "#Code";
import is from "#is";
import test from "@rcompat/test";
import type { Dict, Newable, UnknownFunction } from "@rcompat/type";

type Is = Exclude<keyof typeof is, "instance" | "shape">;

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
        assert(() => is[key as Is](non_value)).throws(Code[`invalid_${key}`]));
    });
  });
});

test.case("dict", assert => {
  const valid: Dict[] = [
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
  invalid.forEach(v => assert(() => is.dict(v)).throws(Code.invalid_dict));
});

test.case("dict - edge cases", assert => {
  const nullproto: Dict = Object.create(null);
  const plain = { x: 1 };

  const customProto = { z: 1 };
  const withCustomProto = Object.create(customProto);
  withCustomProto.a = 1;

  class K { }
  const instance = new K();

  assert(is.dict(plain)).equals(plain).type<{ x: number }>();
  assert(is.dict(nullproto)).equals(nullproto).type<Dict>();

  [withCustomProto, instance, new Map(), new Set(), [], new Date()].forEach(v =>
    assert(() => is.dict(v)).throws(Code.invalid_dict),
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
  invalid.forEach(v => assert(() => is.uuid(v)).throws(Code.invalid_uuid));
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
    assert(() => is.object(v)).throws(Code.invalid_object),
  );

  assert(is.array(array)).equals(array).type<unknown[]>();
  [object, instance, null, 1, "x", true, undefined].forEach(v =>
    assert(() => is.array(v)).throws(Code.invalid_array),
  );

  assert(is.defined("")).equals("");
  assert(is.defined(0)).equals(0);
  assert(is.defined(false)).equals(false);
  assert(() => is.defined(undefined)).throws(Code.invalid_defined);

  assert(is.undefined(undefined)).equals(undefined).type<undefined>();
  [null, 0, false, "", {}].forEach(v =>
    assert(() => is.undefined(v)).throws(Code.invalid_undefined),
  );

  assert(is.null(null)).equals(null).type<null>();
  [undefined, 0, false, "", {}].forEach(v =>
    assert(() => is.null(v)).throws(Code.invalid_null));
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
    assert(() => is.newable(v)).throws(Code.invalid_newable),
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
  assert(() => is.instance(other, Base)).throws(Code.invalid_instance);
  assert(() => is.instance({}, Base)).throws(Code.invalid_instance);
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
    assert(() => int(v)).throws(Code.invalid_int),
  );

  assert(uint(10)).equals(10).type<number | bigint>();
  assert(uint(0)).equals(0).type<number | bigint>();
  assert(uint(-0)).equals(-0).type<number | bigint>();
  assert(uint(10n)).equals(10n).type<number | bigint>();
  assert(() => uint(1.5)).throws(Code.invalid_uint);
  assert(() => uint("1")).throws(Code.invalid_uint);
  [Number.NaN, Infinity, -Infinity, -1, 2.5, -1n].forEach(v =>
    assert(() => uint(v)).throws(Code.invalid_uint),
  );
});

test.case("true / false (literal booleans)", assert => {
  assert(is.true(true)).equals(true).type<true>();
  assert(is.false(false)).equals(false).type<false>();

  [false, 1, "true", null, undefined].forEach(v =>
    assert(() => is.true(v)).throws(Code.invalid_true),
  );
  [true, 0, "", null, undefined].forEach(v =>
    assert(() => is.false(v)).throws(Code.invalid_false),
  );
});

test.case("boolean wrapper objects are not boolean primitives", assert => {
  const boxedTrue = new Boolean(true);
  const boxedFalse = new Boolean(false);

  [boxedTrue, boxedFalse].forEach(v =>
    assert(() => is.boolean(v)).throws(Code.invalid_boolean),
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
    assert(() => is.newable(v)).throws(Code.invalid_newable),
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
    assert(() => is.symbol(v)).throws(Code.invalid_symbol),
  );
});

test.case("date", assert => {
  const d = new Date();
  assert(is.date(d)).equals(d).type<Date>();
  assert(() => is.date(Date.now())).throws(Code.invalid_date);
  assert(() => is.date("today")).throws(Code.invalid_date);
});

test.case("map", assert => {
  const m = new Map([["a", 1]]);
  assert(is.map(m)).equals(m).type<Map<unknown, unknown>>();
  assert(() => is.map({})).throws(Code.invalid_map);
  assert(() => is.map(new Set())).throws(Code.invalid_map);
});

test.case("set", assert => {
  const s = new Set([1, 2, 3]);
  assert(is.set(s)).equals(s).type<Set<unknown>>();
  assert(() => is.set({})).throws(Code.invalid_set);
  assert(() => is.set(new Map())).throws(Code.invalid_set);
});

test.case("regexp", assert => {
  const r = /test/;
  assert(is.regexp(r)).equals(r).type<RegExp>();
  assert(() => is.regexp("test")).throws(Code.invalid_regexp);
  assert(() => is.regexp({})).throws(Code.invalid_regexp);
});

test.case("url", assert => {
  const u = new URL("https://example.com");
  assert(is.url(u)).equals(u).type<URL>();
  assert(() => is.url("https://example.com")).throws(Code.invalid_url);
  assert(() => is.url({})).throws(Code.invalid_url);
});

test.case("promise", assert => {
  const p = Promise.resolve(42);
  assert(is.promise(p)).equals(p).type<Promise<unknown>>();
  assert(() => is.promise({})).throws(Code.invalid_promise);
  assert(() => is.promise(() => { })).throws(Code.invalid_promise);
});

test.case("error", assert => {
  const e = new Error("test");
  const te = new TypeError("test");
  assert(is.error(e)).equals(e).type<Error>();
  assert(is.error(te)).equals(te).type<Error>();
  assert(() => is.error("error")).throws(Code.invalid_error);
  assert(() => is.error({})).throws(Code.invalid_error);
});

test.case("finite", assert => {
  assert(is.finite(42)).equals(42).type<number | bigint>();
  assert(is.finite(-42)).equals(-42).type<number | bigint>();
  assert(is.finite(3.14)).equals(3.14).type<number | bigint>();
  assert(is.finite(42n)).equals(42n).type<number | bigint>();
  assert(() => is.finite(NaN)).throws(Code.invalid_finite);
  assert(() => is.finite(Infinity)).throws(Code.invalid_finite);
  assert(() => is.finite(-Infinity)).throws(Code.invalid_finite);
});

test.case("safeint", assert => {
  const MSI = Number.MAX_SAFE_INTEGER;

  assert(is.safeint(42)).equals(42).type<number>();
  assert(is.safeint(MSI)).equals(MSI).type<number>();
  assert(() => is.safeint(MSI + 1)).throws(Code.invalid_safeint);
  assert(() => is.safeint(3.14)).throws(Code.invalid_safeint);
  assert(() => is.safeint(42n)).throws(Code.invalid_safeint);
});

test.case("nan", assert => {
  assert(is.nan(NaN)).type<number>();
  assert(is.nan(Number.NaN)).type<number>();
  assert(() => is.nan(42)).throws(Code.invalid_nan);
  assert(() => is.nan("NaN")).throws(Code.invalid_nan);
});

test.case("nullish", assert => {
  assert(is.nullish(null)).equals(null);
  assert(is.nullish(undefined)).equals(undefined);
  assert(() => is.nullish(0)).throws(Code.invalid_nullish);
  assert(() => is.nullish("")).throws(Code.invalid_nullish);
  assert(() => is.nullish(false)).throws(Code.invalid_nullish);
});

test.case("nonempty", assert => {
  assert(is.nonempty("hello")).equals("hello");
  assert(is.nonempty([1, 2])).equals([1, 2]);
  assert(is.nonempty({ a: 1 }));
  assert(is.nonempty(new Map([["a", 1]])));
  assert(is.nonempty(new Set([1])));
  assert(() => is.nonempty("")).throws(Code.invalid_nonempty);
  assert(() => is.nonempty([])).throws(Code.invalid_nonempty);
  assert(() => is.nonempty({})).throws(Code.invalid_nonempty);
  assert(() => is.nonempty(new Map())).throws(Code.invalid_nonempty);
  assert(() => is.nonempty(new Set())).throws(Code.invalid_nonempty);
});
