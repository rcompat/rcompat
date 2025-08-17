import fn from "#includes";
import test from "@rcompat/test";

test.case("string", assert => {
  assert(fn("", "")).true();
  assert(fn("foo", "foo")).true();
  assert(fn("foo", "fo")).true();
  assert(fn("foo", "o")).true();
  assert(fn("foo", "oo")).true();
  assert(fn("foo", "")).true();

  assert(fn("foo", "bar")).false();
  assert(fn("", "foo")).false();
  assert(fn("f", "foo")).false();
  assert(fn("fo", "foo")).false();
  assert(fn("oo", "foo")).false();
});

test.case("number", assert => {
  assert(fn(0, 0)).true();
  assert(fn(0, -0)).true();
  assert(fn(1, 1)).true();
  assert(fn(Infinity, Infinity)).true();
  assert(fn(-Infinity, -Infinity)).true();
  assert(fn(NaN, NaN)).true();

  assert(fn(1, 0)).false();
  assert(fn(0, 1)).false();
});

test.case("bigint", assert => {
  assert(fn(0n, 0n)).true();
  assert(fn(0n, -0n)).true();
  assert(fn(1n, 1n)).true();

  assert(fn(1n, 0n)).false();
  assert(fn(0n, 1n)).false();
});

test.case("boolean", assert => {
  assert(fn(true, true)).true();
  assert(fn(false, false)).true();

  assert(fn(true, false)).false();
  assert(fn(false, true)).false();
});

test.case("symbol", assert => {
  assert(fn(Symbol.for("foo"), Symbol.for("foo"))).true();

  assert(fn(Symbol("foo"), Symbol("foo"))).false();
  assert(fn(Symbol("foo"), Symbol("bar"))).false();
  assert(fn(Symbol.for("foo"), Symbol.for("baz"))).false();
});

test.case("undefined", assert => {
  assert(fn(undefined, undefined)).true();

  assert(fn(undefined, null)).false();
  assert(fn(null, undefined)).false();
});

test.case("null", assert => {
  assert(fn(null, null)).true();

  assert(fn(null, {})).false();
  assert(fn({}, null)).false();
});

test.case("object", assert => {
  assert(fn({}, {})).true();
  assert(fn({ foo: "bar" }, { foo: "bar" })).true();
  assert(fn({ foo: "bar" }, {})).true();
  assert(fn({ bar: [], foo: "bar"}, { foo: "bar" })).true();
  assert(fn({ bar: [0, 1], foo: "bar"}, { bar: [0], foo: "bar" })).true();

  assert(fn({}, { foo: "bar" })).false();
  assert(fn({ foo: "bar"}, { foo: "baz" })).false();
  assert(fn({ foo: "bar"}, { bar: "baz" })).false();
  assert(fn({ foo: "bar"}, { bar: [], foo: "bar" })).false();
});

test.case("Array", assert => {
  assert(fn([], [])).true();
  assert(fn(["" ], ["" ])).true();
  assert(fn(["",, ""], ["",, ""])).true();
  assert(fn([ { foo: "bar" }], [ { foo: "bar" }])).true();
  assert(fn(["foo"], [])).true();
  assert(fn(["foo", "bar"], ["bar"])).true();
  assert(fn(["foo", ["bar", "baz"]], ["foo", ["baz"]])).true();
  assert(fn(["", "foo"], ["" ])).true();
  assert(fn(["foo", "bar", "baz", "bat"], ["bar", "baz"])).true();

  assert(fn([], ["foo"])).false();
  assert(fn(["" ], ["", "foo"])).false();
  assert(fn(["" ], [, "foo"])).false();
  assert(fn(["" ], [, ""])).false();
  assert(fn(["foo", "bar", "baz", "bat"], ["bar", "bat"])).false();
});

test.case("Date", assert => {
  const now = Date.now();
  const d0 = new Date(now);
  const d1 = new Date(now);

  assert(fn(d0, d0)).true();
  assert(fn(d0, d1)).true();

  assert(fn(d0, new Date(now+1))).false();
});

test.case("Set", assert => {
  const set = (...args: unknown[]) => new Set(args);
  const s0 = set("foo");

  assert(fn(s0, s0)).true();
  assert(fn(s0, set("foo"))).true();
  assert(fn(set(1, 2), set(2, 1))).true();
  assert(fn(set(2, 1, 2), set(2, 1))).true();
  assert(fn(set(0), set(...Array.from({ length: 10 }, _ => 0)))).true();
  assert(fn(set({ foo: "bar" }), set({ foo: "bar" }))).true();
  assert(fn(set({ foo: "bar" }, { bar: "baz" }),
    set({ bar: "baz" }, { foo: "bar" }))).true();
  assert(fn(set(1, 2, 3), set(1, 2))).true();
  assert(fn(set({ foo: "bar" }, { bar: "baz" }), set({ bar: "baz" }))).true();
  assert(fn(set("foo", "bar"), set("bar"))).true();
  assert(fn(set("foo", ["bar", "baz"]), set("foo", ["baz"]))).true();
  assert(fn(set("", "foo"), set(""))).true();
  assert(fn(set("foo", "bar", "baz", "bat"), set("bar", "baz"))).true();
  assert(fn(set("foo", "bar", "baz", "bat"), set("bar", "bat"))).true();

  assert(fn(s0, set("bar"))).false();
  assert(fn(set(1, 2), set(1, 2, 3))).false();
  assert(fn(set(), set(1))).false();
  assert(fn(set(1), set(0))).false();
  assert(fn(set(""), set("", "foo"))).false();
  assert(fn(set(""), set(undefined, "foo"))).false();
  assert(fn(set(""), set(undefined, ""))).false();
});

test.case("Map", assert => {
  const map = (o = {}) => new Map(Object.entries(o));

  const o0 = { foo: "bar" };
  const o1 = { foo: { bar: "baz" }};
  const o2 = { bar: "baz", foo: "bar" };
  const m0 = map(o0);

  assert(fn(map(), map())).true();
  assert(fn(m0, m0)).true();
  assert(fn(m0, map(o0))).true();
  assert(fn(map(o1), map(o1))).true();
  assert(fn(map(o0), map())).true();
  assert(fn(map({ bar: [], foo: "bar"}), map({ foo: "bar" }))).true();
  assert(fn(map({ bar: [0, 1], foo: "bar"}), map({ bar: [0], foo: "bar" })))
    .true();

  assert(fn(map(o0), map(o1))).false();
  assert(fn(map(o2), map(o1))).false();
  assert(fn(map(), map(o0))).false();
  assert(fn(map(), map({ foo: "bar" }))).false();
  assert(fn(map({ foo: "bar"}), map({ foo: "baz" }))).false();
  assert(fn(map({ foo: "bar"}), map({ bar: "baz" }))).false();
  assert(fn(map({ foo: "bar"}), map({ bar: [], foo: "bar" }))).false();
});
