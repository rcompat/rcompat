import is from "#is";
import test from "@rcompat/test";

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
      assert(is[key as Is](value)).true();
      non_values.forEach(non_value =>
        assert(() => is[key as Is](non_value)).throws());
    });
  });
});

test.case("dict", assert => {
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

  valid.forEach(v => assert(is.dict(v)).true());
  invalid.forEach(v => assert(() => is.dict(v)).throws());
});

test.case("dict - edge cases", assert => {
  const nullproto = Object.create(null);
  const plain = { x: 1 };

  // custom prototype (should fail)
  const customProto = { z: 1 };
  const withCustomProto = Object.create(customProto);
  withCustomProto.a = 1;

  class K { }
  const instance = new K();

  assert(is.dict(plain)).true();
  assert(is.dict(nullproto)).true();

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

  assert(is.uuid(valid)).true();
  invalid.forEach(v => assert(() => is.uuid(v)).throws());
});

test.case("uuid matches crypto.randomUUID output", assert => {
  // try a few samples to cover randomness
  for (let i = 0; i < 5; i++) {
    const id = crypto.randomUUID();
    // should pass validator and be typed as string
    assert(is.uuid(id)).true();
    // and must be lowercase (extra sanity check)
    assert(id).equals(id.toLowerCase());
  }
});

test.case("object / array / defined / undefined / null", assert => {
  const object = { a: 1 };
  const array: unknown[] = [1, 2, 3];
  class C { }
  const instance = new C();

  assert(is.object(object)).true();
  assert(is.object(array)).true();
  assert(is.instance(instance, C)).true();

  [null, 1, "x", true, undefined].forEach(v =>
    assert(() => is.object(v)).throws(),
  );

  assert(is.array(array)).true();
  [object, instance, null, 1, "x", true, undefined].forEach(v =>
    assert(() => is.array(v)).throws(),
  );

  ["", 0, false, {}, []].forEach(v => assert(is.defined(v)).true());
  assert(() => is.defined(undefined)).throws();

  assert((is.undefined as any)()).true();
  assert(is.undefined(undefined)).true();
  [null, 0, false, "", {}].forEach(v =>
    assert(() => is.undefined(v)).throws(),
  );

  assert(is.null(null)).true();
  [undefined, 0, false, "", {}].forEach(v => assert(() => is.null(v)).throws());
});

test.case("newable", assert => {
  class C { }
  function F(this: any) { /* classic function constructor */ }
  const arrow = () => { };
  const plain = {};

  assert(is.newable(C)).true();
  assert(is.newable(F)).true();

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

  assert(is.instance(sub, Base)).true();
  assert(is.instance(sub, Sub)).true();
  assert(() => is.instance(other, Base)).throws();
  assert(() => is.instance({}, Base)).throws();
});

test.case("number", assert => {
  // number() accepts any typeof "number"
  assert(is.number(NaN)).true();
  assert(is.number(Infinity)).true();

});

test.case("(u)int", assert => {
  const { int, uint } = is;

  assert(int(10)).true();
  assert(int(-10)).true();
  assert(int(0)).true();
  assert(int(-0)).true();
  [Number.NaN, Infinity, -Infinity, 1.1].forEach(v =>
    assert(() => int(v)).throws(),
  );

  assert(uint(10)).true();
  assert(uint(0)).true();
  assert(uint(-0)).true();
  assert(() => uint(1.5)).throws();
  assert(() => uint("1")).throws();
  [Number.NaN, Infinity, -Infinity, -1, 2.5].forEach(v =>
    assert(() => uint(v)).throws(),
  );
  [-1, -999, 1.1, NaN, Infinity, -Infinity].forEach(v =>
    assert(() => uint(v)).throws(),
  );
});

test.case("true / false (literal booleans)", assert => {
  assert(is.true(true)).true();
  assert(is.false(false)).true();

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
  assert(is.function(() => undefined)).true();
});

test.case("function varieties + newable cross-check", assert => {
  function F() { /* classic function */ }
  const arrow = () => { };
  async function A() { }
  function* G() { yield 1; } // generator
  const bound = F.bind(null);
  class C { }

  // function(): accepts all callables (including class constructors)
  assert(is.function(F)).true();
  assert(is.function(arrow)).true();
  assert(is.function(A)).true();
  assert(is.function(G)).true();
  assert(is.function(bound)).true();
  assert(is.function(C)).true();

  // newable(): only true constructors should pass
  assert(is.newable(C)).true();
  assert(is.newable(F)).true();
  assert(is.newable(bound)).true();
  [arrow, A, G, {}, 1, "x", null, undefined].forEach(v =>
    assert(() => is.newable(v)).throws(),
  );
});

test.case("symbol", assert => {
  const s = Symbol("x");
  const a = Symbol.for("foo");
  const b = Symbol.for("foo"); // same as b

  assert(is.symbol(s)).true();
  assert(is.symbol(a)).true();
  assert(a).equals(b); // sanity: global registry returns same symbol

  [1, "s", null, undefined, {}, [], () => { }].forEach(v =>
    assert(() => is.symbol(v)).throws(),
  );
});

