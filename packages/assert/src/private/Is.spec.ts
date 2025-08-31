import Is from "#Is";
import test from "@rcompat/test";
import type UnknownFunction from "@rcompat/type/UnknownFunction";

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
} satisfies Partial<Record<keyof Is, unknown[]>>;

const fixtures = Object.entries(fix) as [keyof typeof fix, unknown[]][];

test.case("non objects", assert => {
  fixtures.forEach(([key, values]) => {
    const non_values = fixtures.filter(entry => entry[0] !== key)
      .flatMap(([, value]) => value);
    values.forEach(value => {
      assert(new Is(value)[key]()).equals(value);
      non_values.forEach(non_value =>
        assert(() => new Is(non_value)[key]()).throws());
    });
  });
});

test.case("record", assert => {
  const valid: unknown[] = [
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

  valid.forEach(v => assert(new Is(v).record()).equals(v));
  invalid.forEach(v => assert(() => new Is(v).record()).throws());
});

test.case("record - edge cases", assert => {
  const nullproto = Object.create(null);
  const plain = { x: 1 };

  // custom prototype (should fail)
  const customProto = { z: 1 };
  const withCustomProto = Object.create(customProto);
  withCustomProto.a = 1;

  class K { }
  const instance = new K();

  assert(new Is(plain).record()).equals(plain);
  assert(new Is(nullproto).record()).equals(nullproto);

  [withCustomProto, instance, new Map(), new Set(), [], new Date()].forEach(v =>
    assert(() => new Is(v).record()).throws(),
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

  assert(new Is(valid).uuid()).equals(valid).type<string>();
  invalid.forEach(v => assert(() => new Is(v).uuid()).throws());
});

test.case("uuid matches crypto.randomUUID output", assert => {
  // Try a few samples to cover randomness
  for (let i = 0; i < 5; i++) {
    const id = crypto.randomUUID();
    // Should pass validator and be typed as string
    assert(new Is(id).uuid()).equals(id).type<string>();
    // And must be lowercase (extra sanity check)
    assert(id).equals(id.toLowerCase());
  }
});

test.case("object / array / defined / undefined / null", assert => {
  const object = { a: 1 };
  const array: unknown[] = [1, 2, 3];
  class C { }
  const instance = new C();
  type Dict = Record<PropertyKey, unknown>;

  assert(new Is(object).object()).equals(object).type<Dict>();
  assert(new Is(array).object()).equals(array).type<Dict>();
  assert(new Is(instance).object()).equals(instance).type<Dict>();

  [null, 1, "x", true, undefined].forEach(v =>
    assert(() => new Is(v).object()).throws(),
  );

  assert(new Is(array).array()).equals(array).type<unknown[]>();
  [object, instance, null, 1, "x", true, undefined].forEach(v =>
    assert(() => new Is(v).array()).throws(),
  );

  ["", 0, false, {}, []].forEach(v =>
    assert(new Is(v).defined()).equals(v).type<unknown>(),
  );
  assert(() => new Is(undefined).defined()).throws();

  assert(new Is(undefined).undefined()).undefined();
  [null, 0, false, "", {}].forEach(v =>
    assert(() => new Is(v).undefined()).throws(),
  );

  assert(new Is(null).null()).equals(null);
  [undefined, 0, false, "", {}].forEach(v =>
    assert(() => new Is(v).null()).throws(),
  );
});

test.case("newable", assert => {
  class C { }
  function F(this: any) { /* classic function constructor */ }
  const arrow = () => { };
  const plain = {};

  assert(new Is(C).newable()).equals(C)/*.type<new (...args: any) => any>()*/;
  assert(new Is(F).newable()).equals(F)/*.type<new (...args: any) => any>()*/;

  [arrow, plain, 1, "x", null, undefined].forEach(v =>
    assert(() => new Is(v).newable()).throws(),
  );
});

test.case("instance / subclass", assert => {
  class Base { }
  class Sub extends Base { }
  class Other { }

  const sub = new Sub();
  const other = new Other();

  assert(new Is(sub).instance(Base)).equals(sub).type<Sub>();
  assert(new Is(sub).instance(Sub)).equals(sub).type<Sub>();
  assert(() => new Is(other).instance(Base)).throws();
  assert(() => new Is({}).instance(Base)).throws();

  assert(new Is(Sub).subclass(Base)).equals(Sub).type<typeof Sub>();
  // not a *sub*class of itself
  assert(() => new Is(Base).subclass(Base)).throws();
  assert(() => new Is(Other).subclass(Base)).throws();
  assert(() => new Is({}).subclass(Base)).throws();
});

test.case("anyOf", assert => {
  class A { }
  class B { }
  class C { }

  const a = new A();
  const b = new B();
  const c = new C();

  // passes for A or B
  assert(new Is(a).anyOf([A, B])).equals(a)/*.type<A | B>()*/;
  assert(new Is(b).anyOf([A, B])).equals(b)/*.type<A | B>()*/;

  // fails for C
  assert(() => new Is(c).anyOf([A, B])).throws();

  // also fails for primitives
  [null, 1, "x", true, {}, []].forEach(v =>
    assert(() => new Is(v).anyOf([A, B])).throws(),
  );
});

test.case("number", assert => {
  const nan = Number.NaN;
  const plusInfinity = Infinity;
  const minusZero = -0;

  // number() accepts any typeof "number"
  const nanResult = new Is(nan).number();
  assert(Number.isNaN(nanResult)).true();
  assert(new Is(plusInfinity).number()).equals(plusInfinity).type<number>();

  // integer() rejects NaN/Infinity/floats, accepts -0 as integer
  assert(new Is(minusZero).integer()).equals(minusZero);
  [nan, plusInfinity, -Infinity, 1.1].forEach(v =>
    assert(() => new Is(v).integer()).throws(),
  );

  // usize() accepts -0 (since -0 >= 0 is true),
  // rejects NaN/Infinity/negatives/floats
  assert(new Is(minusZero).usize()).equals(minusZero);
  [nan, plusInfinity, -Infinity, -1, 2.5].forEach(v =>
    assert(() => new Is(v).usize()).throws(),
  );
});

test.case("integer / isize / usize", assert => {
  // integer
  assert(new Is(0).integer()).equals(0).type<number>();
  assert(new Is(-10).integer()).equals(-10);
  assert(() => new Is(1.5).integer()).throws();
  assert(() => new Is("1").integer()).throws();

  // isize (alias)
  assert(new Is(42).isize()).equals(42);
  assert(() => new Is(3.14).isize()).throws();

  // usize (non-negative integer)
  assert(new Is(0).usize()).equals(0);
  assert(new Is(123).usize()).equals(123);
  [-1, -999, 1.1, NaN, Infinity, -Infinity].forEach(v =>
    assert(() => new Is(v).usize()).throws(),
  );
});

test.case("true / false (literal booleans)", assert => {
  assert(new Is(true).true()).true().type<true>();
  assert(new Is(false).false()).false().type<false>();

  [false, 1, "true", null, undefined].forEach(v =>
    assert(() => new Is(v).true()).throws(),
  );
  [true, 0, "", null, undefined].forEach(v =>
    assert(() => new Is(v).false()).throws(),
  );
});

test.case("boolean wrapper objects are not boolean primitives", assert => {
  const boxedTrue = new Boolean(true);
  const boxedFalse = new Boolean(false);

  [boxedTrue, boxedFalse].forEach(v =>
    assert(() => new Is(v).boolean()).throws(),
  );
});

test.case("function", assert => {
  const fn = () => undefined;

  assert(new Is(fn).function()).equals(fn)
    .type<(...args: unknown[]) => unknown>();
});

test.case("function varieties + newable cross-check", assert => {
  function F() { /* classic function */ }
  const arrow = () => { };
  async function A() { }
  function* G() { yield 1; } // generator
  const bound = F.bind(null);
  class C { }

  // function(): accepts all callables (including class constructors)
  assert(new Is(F).function()).equals(F).type<UnknownFunction>();
  assert(new Is(arrow).function()).equals(arrow).type<UnknownFunction>();
  assert(new Is(A).function()).equals(A).type<UnknownFunction>();
  assert(new Is(G).function()).equals(G).type<UnknownFunction>();
  assert(new Is(bound).function()).equals(bound).type<UnknownFunction>();
  assert(new Is(C).function()).equals(C).type<UnknownFunction>();

  // newable(): only true constructors should pass
  assert(new Is(C).newable()).equals(C)/*.type<new (...args: any[]) => any>()*/;
  assert(new Is(F).newable()).equals(F)/*.type<new (...args: any[]) => any>()*/;
  [arrow, A, G, bound, {}, 1, "x", null, undefined].forEach(v =>
    assert(() => new Is(v).newable()).throws(),
  );
});

test.case("symbol", assert => {
  const s = Symbol("x");
  const a = Symbol.for("foo");
  const b = Symbol.for("foo"); // same as b

  assert(new Is(s).symbol()).equals(s).type<symbol>();
  assert(new Is(a).symbol()).equals(a).type<symbol>();
  assert(a).equals(b); // sanity: global registry returns same symbol

  [1, "s", null, undefined, {}, [], () => { }].forEach(v =>
    assert(() => new Is(v).symbol()).throws(),
  );
});

