import equals from "#equals";

export default test => {
  test.case("string", assert => {
    assert(equals("", "")).true();
    assert(equals("foo", "foo")).true();
    assert(equals("foo", "bar")).false();

    assert(equals("foo", "")).false();
    assert(equals("", "foo")).false();
  });

  test.case("number", assert => {
    assert(equals(0, 0)).true();
    assert(equals(0, -0)).true();
    assert(equals(1, 1)).true();
    assert(equals(Infinity, Infinity)).true();
    assert(equals(-Infinity, -Infinity)).true();
    assert(equals(NaN, NaN)).true();

    assert(equals(1, 0)).false();
    assert(equals(0, 1)).false();
  });

  test.case("bigint", assert => {
    assert(equals(0n, 0n)).true();
    assert(equals(0n, -0n)).true();
    assert(equals(1n, 1n)).true();

    assert(equals(1n, 0n)).false();
    assert(equals(0n, 1n)).false();
  });

  test.case("boolean", assert => {
    assert(equals(true, true)).true();
    assert(equals(false, false)).true();

    assert(equals(true, false)).false();
    assert(equals(false, true)).false();
  });

  test.case("symbol", assert => {
    assert(equals(Symbol.for("foo"), Symbol.for("foo"))).true();

    assert(equals(Symbol("foo"), Symbol("foo"))).false();
    assert(equals(Symbol("foo"), Symbol("bar"))).false();
    assert(equals(Symbol.for("foo"), Symbol.for("baz"))).false();
  });

  test.case("undefined", assert => {
    assert(equals(undefined, undefined)).true();

    assert(equals(undefined, null)).false();
    assert(equals(null, undefined)).false();
  });

  test.case("null", assert => {
    assert(equals(null, null)).true();

    assert(equals(null, {})).false();
    assert(equals({}, null)).false();
  });

  test.case("object", assert => {
    assert(equals({}, {})).true();
    assert(equals({ foo: "bar" }, { foo: "bar" })).true();

    assert(equals({}, { foo: "bar" })).false();
    assert(equals({ foo: "bar" }, {})).false();
    assert(equals({ foo: "bar"}, { foo: "baz" })).false();
    assert(equals({ foo: "bar"}, { bar: "baz" })).false();
    assert(equals({ foo: "bar"}, { foo: "bar", bar: [] })).false();
  });

  test.case("Array", assert => {
    assert(equals([], [])).true();
    assert(equals(["", ], ["", ])).true();
    assert(equals(["",, ""], ["",, ""])).true();
    assert(equals([ { foo: "bar" }], [ { foo: "bar" }])).true();

    assert(equals([], ["foo"])).false();
    assert(equals(["foo"], [])).false();
    assert(equals(["", ], ["", "foo"])).false();
    assert(equals(["", "foo", "", ])).false();
    assert(equals(["", ], [, ""])).false();
  });

  test.case("Date", assert => {
    const now = Date.now();
    const d0 = new Date(now);
    const d1 = new Date(now);

    assert(equals(d0, d0)).true();
    assert(equals(d0, d1)).true();

    assert(equals(d0, new Date(now+1))).false();
  });

  test.case("Set", assert => {
    const s0 = new Set(["foo"]);

    assert(equals(s0, s0)).true();
    assert(equals(s0, new Set(["foo"]))).true();
    assert(equals(new Set([1, 2]), new Set([2, 1]))).true();
    assert(equals(new Set([2, 1, 2]), new Set([2, 1]))).true();
    assert(equals(new Set([0]), new Set(Array.from({ length: 10 }, _ => 0)))).true();
    assert(equals(new Set([{ foo: "bar" }]), new Set([{ foo: "bar" }]))).true();
    assert(equals(new Set([{ foo: "bar" }, { bar: "baz" }]), new Set([{ bar: "baz" }, { foo: "bar" }]))).true();

    assert(equals(s0, new Set(["bar"]))).false();
    assert(equals(new Set([1, 2]), new Set([1, 2, 3]))).false();
    assert(equals(new Set([1, 2, 3]), new Set([1, 2]))).false();
    assert(equals(new Set([]), new Set([1]))).false();
    assert(equals(new Set([1]), new Set([0]))).false();
  });

  test.case("Map", assert => {
    const map = o => new Map(Object.entries(o));

    const o0 = { foo: "bar" };
    const o1 = { foo: { bar: "baz" }};
    const m0 = map(o0);

    assert(equals(new Map(), new Map())).true();
    assert(equals(m0, m0)).true();
    assert(equals(m0, map(o0))).true();
    assert(equals(map(o1), map(o1))).true();

    assert(equals(map(o0), map(o1))).false();
    assert(equals(new Map(), map(o0))).false();
  });
};
